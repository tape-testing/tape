'use strict';

var defined = require('defined');
var through = require('@ljharb/through');

var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var Results = require('./lib/results');

var canEmitExit = typeof process !== 'undefined' && process
	// eslint-disable-next-line no-extra-parens
	&& typeof process.on === 'function' && /** @type {{ browser?: boolean }} */ (process).browser !== true;
var canExit = typeof process !== 'undefined' && process
	&& typeof process.exit === 'function';

/** @typedef {import('.')} Tape */
/** @typedef {import('.').Harness} Harness */
/** @typedef {import('.').HarnessConfig} HarnessConfig */
/** @typedef {import('.').HarnessCallSignatures} HarnessCallSignatures */
/** @typedef {import('.').TestOptions} TestOptions */
/** @typedef {import('.').HarnessEventHandler} HarnessEventHandler */
/** @typedef {import('.').CreateStream} CreateStream */
/** @typedef {import('.').createHarness} CreateHarness */
/** @typedef {import('./lib/results').Result} Result */
/** @typedef {import('stream').Writable} WritableStream */

module.exports = (function () {
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

	/** @type {(this: Harness, ...args: Parameters<Tape>) => ReturnType<Tape>} */
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

	lazyLoad.onFinish = function () {
		return getHarness().onFinish.apply(this, arguments);
	};

	lazyLoad.onFailure = function () {
		return getHarness().onFailure.apply(this, arguments);
	};

	lazyLoad.getHarness = getHarness;

	return lazyLoad;
}());

/** @type {CreateHarness} */
function createHarness(conf_) {
	var results = new Results({ todoIsOK: !!(process.env.TODO_IS_OK === '1') });
	if (!conf_ || conf_.autoclose !== false) {
		results.once('done', function () { results.close(); });
	}

	/** @type {(name: string, conf: TestOptions, cb: Test.Callback) => Test} */
	function test(name, conf, cb) {
		var t = new Test(name, conf, cb);
		test._tests.push(t);

		(function inspectCode(st) {
			st.on('test', /** @type {(st: Test) => void} */ function sub(st_) {
				inspectCode(st_);
			});
			st.on('result', /** @type {(r: Result) => void} */ function (r) {
				if (!r.todo && !r.ok && typeof r !== 'string') { test._exitCode = 1; }
			});
		}(t));

		results.push(t);
		return t;
	}
	test._results = results;

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
	/** @type {() => Test} */
	test.only = function () {
		if (only) { throw new Error('there can only be one only test'); }
		if (conf_ && conf_.noOnly) { throw new Error('`only` tests are prohibited'); }
		only = true;
		var t = test.apply(null, arguments);
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
		// eslint-disable-next-line no-extra-parens
		var es = stream.pipe(/** @type {WritableStream} */ (cStream || createDefaultStream()));
		if (canEmitExit && es) { // in node v0.4, `es` is `undefined`
			// TODO: use `err` arg?
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

	process.on('exit', function (code) {
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

module.exports.createHarness = createHarness;
var moduleExports = module.exports; // this hack is needed because TS has a bug with seemingly circular exports
moduleExports.Test = Test;
moduleExports.test = module.exports; // tap compat
moduleExports.skip = Test.skip;
