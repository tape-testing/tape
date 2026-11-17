'use strict';

var callBound = require('call-bound');
var defined = require('defined');
var through = require('@ljharb/through');

var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var Results = require('./lib/results');

var $indexOf = callBound('Array.prototype.indexOf');

var canEmitExit = typeof process !== 'undefined'
	&& process
	&& typeof process.on === 'function'
	&& /** @type {{ browser?: boolean }} */ (process).browser !== true;
var canExit = typeof process !== 'undefined'
	&& process
	&& typeof process.exit === 'function';

/** @typedef {{ getActiveResourcesInfo?: () => string[] }} ResourcesProcess */
var $getResources = canEmitExit
	? /** @type {ResourcesProcess} */ (process).getActiveResourcesInfo
	: undefined;

// timers, immediates, sockets, fs requests, etc, that keep the event loop alive, ignoring writes, which tape's own output makes.
// node < 16.14 can not tell us, so there, work scheduled by `beforeExit` listeners is only noticed once it asserts or ends the test
function countPendingWork() {
	if (typeof $getResources !== 'function') {
		return 0;
	}
	var resources = $getResources();
	var count = 0;
	for (var i = 0; i < resources.length; i++) {
		if (resources[i] !== 'WriteWrap' && resources[i] !== 'ShutdownWrap') {
			count += 1;
		}
	}
	return count;
}

/**
 * @import Tape, {
 * 	createHarness as CreateHarness,
 * 	CreateStream,
 * 	Harness,
 * 	HarnessConfig,
 * 	HarnessEventHandler,
 * 	TestOptions,
 * } from '.'
 */

/** @import { Result } from './lib/results' */

var tape = (function () {
	var wait = false;
	/** @type {undefined | Harness} */
	var harness;

	/** @type {(opts?: HarnessConfig) => Harness} */
	function getHarness(opts) {
		// this override is here since tests fail via nyc if createHarness is moved upwards
		if (!harness) {
			// eslint-disable-next-line no-use-before-define
			harness = createExitHarness(opts || {}, wait);
		}
		return harness;
	}

	/** @type {(this: Harness, ...args: Parameters<typeof Tape>) => ReturnType<typeof Tape>} */
	function lazyLoad() {
		// eslint-disable-next-line no-invalid-this
		return getHarness().apply(this, arguments);
	}

	lazyLoad.wait = function () {
		wait = true;
	};

	lazyLoad.run = function () {
		var run = getHarness().run;

		if (run) { run(); }
	};

	lazyLoad.only = function () {
		return getHarness().only.apply(this, arguments);
	};

	/** @type {typeof Test.skip} */
	lazyLoad.skip = function () {
		return getHarness().skip.apply(this, arguments);
	};

	/** @type {CreateStream} */
	lazyLoad.createStream = function (opts) {
		var options = opts || {};
		if (!harness) {
			var output = through();
			getHarness({ stream: output, objectMode: options.objectMode });
			return output;
		}
		return harness.createStream(options);
	};

	/** @type {typeof Tape.onFinish} */
	lazyLoad.onFinish = function () {
		return getHarness().onFinish.apply(this, arguments);
	};

	/** @type {typeof Tape.onFailure} */
	lazyLoad.onFailure = function () {
		return getHarness().onFailure.apply(this, arguments);
	};

	lazyLoad.getHarness = getHarness;

	return lazyLoad;
}());

/** @type {typeof CreateHarness} */
function createHarness(conf_) {
	var results = new Results({ todoIsOK: !!(process.env.TODO_IS_OK === '1') });
	if (!conf_ || conf_.autoclose !== false) {
		results.once('done', function () { results.close(); });
	}

	/** @type {(name: string, conf: TestOptions, cb: Test.TestCase) => Test} */
	function test(name, conf, cb) {
		// eslint-disable-next-line no-use-before-define
		return register(new Test(name, conf, cb));
	}

	/** @type {(t: Test) => Test} */
	function register(t) {
		test._tests.push(t);

		(function inspectCode(st) {
			st.on('test', /** @param {Test} st_ */ function sub(st_) {
				inspectCode(st_);
			});
			st.on('result', /** @param {Result} r */ function (r) {
				if (!r.todo && !r.ok && typeof r !== 'string') { test._exitCode = 1; }
			});
		}(t));

		results.push(t);
		return t;
	}
	test._results = results;

	/** @type {typeof Test.skip} */
	test.skip = function () {
		return register(Test.skip.apply(null, arguments));
	};

	/** @type {Test[]} */ test._tests = [];

	/** @type {CreateStream} */
	test.createStream = function (opts) {
		return results.createStream(opts);
	};

	/** @type {HarnessEventHandler} */
	test.onFinish = function (cb) {
		results.on('done', cb);
	};

	/** @type {HarnessEventHandler} */
	test.onFailure = function (cb) {
		results.on('fail', cb);
	};

	var only = false;
	/** @returns {Test} */
	test.only = function () {
		if (only) { throw new Error('there can only be one only test'); }
		if (conf_ && conf_.noOnly) { throw new Error('`only` tests are prohibited'); }
		only = true;
		var t = /** @type {Test} */ (test.apply(null, arguments));
		results.only(t);
		return t;
	};
	test._exitCode = 0;

	test.close = function () { results.close(); };

	// @ts-expect-error TODO FIXME: why is `test` not assignable to `Harness`???
	return test;
}

/** @type {(conf: Omit<HarnessConfig, 'autoclose'>, wait?: boolean) => Harness} */
function createExitHarness(config, wait) {
	var noOnly = config.noOnly;
	var objectMode = config.objectMode;
	var cStream = config.stream;
	var exit = config.exit;

	var harness = createHarness({
		autoclose: !canEmitExit,
		noOnly: defined(noOnly, defined(process.env.NODE_TAPE_NO_ONLY_TEST, false))
	});
	var running = false;
	var ended = false;

	function run() {
		if (running) { return; }
		running = true;
		var stream = harness.createStream({ objectMode: objectMode });
		var es = stream.pipe(/** @type {NodeJS.WritableStream} */ (cStream || createDefaultStream()));
		if (canEmitExit && es) { // in node v0.4, `es` is `undefined`
			// eslint-disable-next-line no-unused-vars
			es.on('error', function (_) { harness._exitCode = 1; });
		}
		stream.on('end', function () { ended = true; });
	}

	if (wait) {
		harness.run = run;
	} else {
		run();
	}

	if (exit === false) { return harness; }
	if (!canEmitExit || !canExit) { return harness; }

	// tests (and subtests) that have started but not ended yet, each with its ancestors; the last one is the innermost
	/** @type {{ test: Test, ancestors: Test[] }[]} */
	var started = [];
	/** @param {Test} t */
	function isStarted(t) {
		for (var i = 0; i < started.length; i++) {
			if (started[i].test === t) { return true; }
		}
		return false;
	}
	/** @type {(t: Test, ancestors: Test[]) => void} */
	function track(t, ancestors) {
		t.once('prerun', function () {
			// a subtest whose parent has already ended (eg, the subtest called `.end()` on its parent) is orphaned: nothing waits on it
			if (ancestors.length === 0 || isStarted(ancestors[ancestors.length - 1])) {
				started[started.length] = { test: t, ancestors: ancestors };
			}
		});
		t.once('end', function () {
			var stillRunning = [];
			for (var i = 0; i < started.length; i++) {
				if (started[i].test !== t && $indexOf(started[i].ancestors, t) < 0) {
					stillRunning[stillRunning.length] = started[i];
				}
			}
			started = stillRunning;
		});
		t.on('test', /** @param {Test} st */ function (st) {
			track(st, ancestors.concat(t));
		});
	}
	harness._results.on('_push', /** @param {Test} t */ function (t) {
		track(t, []);
	});

	// node emits `beforeExit` when the event loop is empty. other `beforeExit` listeners (user code, a library, or the test
	// itself) may still do or schedule work that finishes the running test. so, once every listener has run, if they scheduled
	// no work, we note the innermost running test and its assertion count, and keep the loop alive for one more turn. if the
	// loop empties again with the same test, no new assertions before the listeners ran, and the listeners neither ended it nor
	// scheduled work, it has stalled: fail it and end it, so that the tests after it still run. assertions the listeners make
	// do not count, so a listener that asserts every time can not keep the process alive forever; in node < 6, which can not
	// run our listener first, the round limit does that.
	/** @type {Test | undefined} */
	var stallCandidate;
	var candidateCount = 0;
	var roundsKeptAlive = 0;
	var maxRoundsKeptAlive = 10;
	function innermost() {
		var entry = started[started.length - 1];
		return entry && entry.test;
	}
	function keepAlive() {}

	/** @type {Test | undefined} */
	var testBeforeListeners;
	var countBeforeListeners = 0;
	var workBeforeListeners = 0;

	function checkForStall() {
		var t = ended ? undefined : innermost();
		if (!t || countPendingWork() > workBeforeListeners) {
			stallCandidate = undefined;
			return;
		}
		if (
			t === testBeforeListeners
			&& t === stallCandidate
			&& (countBeforeListeners === candidateCount || roundsKeptAlive >= maxRoundsKeptAlive)
		) {
			if (!t._stalled) {
				t._stalled = true;
				t._exit();
			}
			// with a plan, `_exit()` can start a queued subtest; then `t` ends when its subtests do
			if (!t.ended && innermost() === t) {
				// a test that already called `.end()` is stuck on a teardown that never settles; skip past it
				if (t.calledEnd) {
					t._end();
				} else {
					t.end();
				}
			}
			// ending `t` can start the next test synchronously, and it may stall too
			t = ended ? undefined : innermost();
			if (!t) {
				stallCandidate = undefined;
				return;
			}
		}
		roundsKeptAlive = t === stallCandidate ? roundsKeptAlive + 1 : 1;
		stallCandidate = t;
		candidateCount = t.assertCount;
		setImmediate(keepAlive);
	}

	// run before every other `beforeExit` listener, so that the assertions they make count as theirs
	/** @type {'prependListener' | 'on'} */
	var addListener = typeof process.prependListener === 'function' ? 'prependListener' : 'on';
	process[addListener]('beforeExit', function () {
		testBeforeListeners = ended ? undefined : innermost();
		countBeforeListeners = testBeforeListeners ? testBeforeListeners.assertCount : 0;
		workBeforeListeners = countPendingWork();
		// `nextTick` callbacks run after every `beforeExit` listener has
		process.nextTick(checkForStall);
	});

	process.on('exit', /** @param {number | undefined} code */ function (code) {
		// let the process exit cleanly.
		if (typeof code === 'number' && code !== 0) {
			return;
		}

		if (!ended) {
			var only = harness._results._only;
			for (var i = 0; i < harness._tests.length; i++) {
				var t = harness._tests[i];
				if (!only || t === only) {
					t._exit();
				}
			}
		}
		harness.close();

		process.removeAllListeners('exit'); // necessary for node v0.6
		process.exit(code || harness._exitCode); // eslint-disable-line no-process-exit
	});

	return harness;
}

// `cjs-module-lexer` - used by node's ESM interop and by `attw` - only detects named exports
// from literal `module.exports.x =` statements, so attaching these to `tape` before the export
// assignment, as TS 7 wants, would break `import { test } from 'tape'`. see microsoft/typescript-go#1685.
// @ts-ignore TODO FIXME TS2309
module.exports = tape;

// @ts-ignore TODO FIXME TS2551: attw errors without this line
module.exports.createHarness = createHarness;
// @ts-ignore TODO FIXME TS2339: attw errors without this line
module.exports.Test = Test;
// @ts-ignore TODO FIXME TS2339: attw errors without this line
module.exports.test = tape; // tap compat

// the casts are load-bearing: without them TS 6 reports TS2303, a circular import alias
module.exports.createStream = /** @type {typeof Tape.createStream} */ (tape.createStream);
module.exports.only = /** @type {() => any} */ (tape.only);
module.exports.skip = /** @type {typeof Test.skip} */ (tape.skip);
module.exports.getHarness = /** @type {typeof Tape.getHarness} */ (tape.getHarness);
module.exports.run = /** @type {typeof Tape.run} */ (tape.run);
module.exports.wait = /** @type {typeof Tape.wait} */ (tape.wait);
module.exports.onFinish = /** @type {typeof Tape.onFinish} */ (tape.onFinish);
module.exports.onFailure = /** @type {typeof Tape.onFailure} */ (tape.onFailure);
