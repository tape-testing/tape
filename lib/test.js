'use strict';

var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var hasOwn = require('hasown');
var isRegExp = require('is-regex');
var trim = require('string.prototype.trim');
var callBind = require('call-bind');
var callBound = require('call-bind/callBound');
var forEach = require('for-each');
var inspect = require('object-inspect');
var is = require('object-is/polyfill')();
var objectKeys = require('object-keys');
var every = require('array.prototype.every');
var mockProperty = require('mock-property');

var isEnumerable = callBound('Object.prototype.propertyIsEnumerable');
var toLowerCase = callBound('String.prototype.toLowerCase');
var isProto = callBound('Object.prototype.isPrototypeOf');
var $exec = callBound('RegExp.prototype.exec');
var objectToString = callBound('Object.prototype.toString');
var $split = callBound('String.prototype.split');
var $replace = callBound('String.prototype.replace');
var $strSlice = callBound('String.prototype.slice');
var $push = callBound('Array.prototype.push');
var $shift = callBound('Array.prototype.shift');
var $slice = callBound('Array.prototype.slice');

var nextTick = typeof setImmediate !== 'undefined'
	? setImmediate
	: process.nextTick;
var safeSetTimeout = setTimeout;
var safeClearTimeout = clearTimeout;

/** @typedef {((c: unknown) => c is ErrorConstructor | TypeErrorConstructor | RangeErrorConstructor | EvalErrorConstructor | URIErrorConstructor | ReferenceErrorConstructor | SyntaxErrorConstructor)} IsErrorConstructor */
/** @typedef {import('../').TestOptions} TestOptions */
/** @typedef {import('./test').Callback} Callback */
/** @typedef {import('./test').WrappedCall} WrappedCall */
/** @typedef {import('./results').Result} Result */
/** @typedef {import('./test').Call} Call */
/** @typedef {import('./test')} TestType */

var isErrorConstructor = isProto(Error, TypeError) // IE 8 is `false` here
	? /** @type {IsErrorConstructor} */ function isErrorConstructor(C) {
		return isProto(Error, C);
	}
	: /** @type {IsErrorConstructor} */ function isErrorConstructor(C) {
		return isProto(Error, C)
			|| isProto(TypeError, C)
			|| isProto(RangeError, C)
			|| isProto(SyntaxError, C)
			|| isProto(ReferenceError, C)
			|| isProto(EvalError, C)
			|| isProto(URIError, C);
	};

/** @type {(name_: string, opts_: TestOptions, cb_: Callback) => { name: string, opts: TestOptions, cb: Callback }} */
function getTestArgs() {
	var name = '(anonymous)';
	var opts = {};
	var cb;

	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		if (typeof arg === 'string') {
			name = arg;
		} else if (typeof arg === 'object') {
			opts = arg || opts;
		} else if (typeof arg === 'function') {
			cb = arg;
		}
	}
	return {
		name: name,
		opts: opts,
		cb: cb
	};
}

/**
 * @constructor
 * @param {string} name
 * @param {TestOptions} opts
 * @param {Callback} cb
 */
function Test(name, opts, cb) {
	if (!(this instanceof Test)) {
		return new Test(name, opts, cb);
	}

	var args = getTestArgs(name, opts, cb);

	this.readable = true;
	this.name = args.name || '(anonymous)';
	this.assertCount = 0;
	this.pendingCount = 0;
	this._skip = args.opts.skip || false;
	this._todo = args.opts.todo || false;
	this._timeout = args.opts.timeout;
	this._plan = undefined;
	this._cb = args.cb;
	this.ended = false;
	this._progeny = [];
	this._teardown = [];
	this._ok = true;
	this._objectPrintDepth = 5;
	var depthEnvVar = process.env.NODE_TAPE_OBJECT_PRINT_DEPTH;
	if (args.opts.objectPrintDepth) {
		this._objectPrintDepth = args.opts.objectPrintDepth;
	} else if (depthEnvVar) {
		if (toLowerCase(depthEnvVar) === 'infinity') {
			this._objectPrintDepth = Infinity;
		} else {
			this._objectPrintDepth = Number(depthEnvVar);
		}
	}

	for (var prop in this) {
		if (typeof this[prop] === 'function') {
			// @ts-expect-error TODO: FIXME
			this[prop] = callBind(this[prop], this);
		}
	}
}

inherits(Test, EventEmitter);

/** @type {import('./test').prototype.run} */
Test.prototype.run = function run() {
	this.emit('prerun');
	if (!this._cb || this._skip) {
		this._end();
		return;
	}
	if (this._timeout != null) {
		this.timeoutAfter(this._timeout);
	}

	var callbackReturn = this._cb(this);

	if (
		typeof Promise === 'function'
        && callbackReturn
		// eslint-disable-next-line no-extra-parens
        && typeof /** @type {PromiseLike<unknown>} */ (callbackReturn).then === 'function'
	) {
		var self = this;
		Promise.resolve(callbackReturn).then(
			function onResolve() {
				if (!self.calledEnd) {
					self.end();
				}
			},
			function onError(err) {
				if (err instanceof Error || objectToString(err) === '[object Error]') {
					self.ifError(err);
				} else {
					self.fail(err);
				}
				self.end();
			}
		);
		return;
	}

	this.emit('run');
};

/** @type {import('./test').prototype.test} */
Test.prototype.test = function test(name, opts, cb) {
	var self = this;
	// eslint-disable-next-line no-extra-parens
	var t = /** @type {TestType} */ (/** @type {unknown} */ (new Test(name, opts, cb)));
	$push(this._progeny, t);
	this.pendingCount++;
	this.emit('test', t);
	t.on('prerun', function () {
		self.assertCount++;
	});

	if (!self._pendingAsserts()) {
		nextTick(function () {
			self._end();
		});
	}

	nextTick(function () {
		if (!self._plan && self.pendingCount == self._progeny.length) {
			self._end();
		}
	});
};

/** @type {import('./test').prototype.comment} */
Test.prototype.comment = function comment(msg) {
	var that = this;
	forEach($split(trim(msg), '\n'), /** @type {(aMsg: string) => void} */ function (aMsg) {
		that.emit('result', $replace(trim(aMsg), /^#\s*/, ''));
	});
};

/** @type {import('./test').prototype.plan} */
Test.prototype.plan = function plan(n) {
	this._plan = n;
	this.emit('plan', n);
};

/** @type {import('./test').prototype.timeoutAfter} */
Test.prototype.timeoutAfter = function timeoutAfter(ms) {
	if (!ms) { throw new Error('timeoutAfter requires a timespan'); }
	var self = this;
	var timeout = safeSetTimeout(function () {
		self.fail(self.name + ' timed out after ' + ms + 'ms');
		self.end();
	}, ms);
	this.once('end', function () {
		safeClearTimeout(timeout);
	});
};

/** @type {import('./test').prototype.end} */
Test.prototype.end = function end(err) {
	if (arguments.length >= 1 && !!err) {
		this.ifError(err);
	}

	if (this.calledEnd) {
		this.fail('.end() already called');
	}
	this.calledEnd = true;
	this._end();
};

/** @type {import('./test').prototype.teardown} */
Test.prototype.teardown = function teardown(fn) {
	if (typeof fn !== 'function') {
		this.fail('teardown: ' + inspect(fn) + ' is not a function');
	} else {
		this._teardown.push(fn);
	}
};

/** @type {<T extends Callback>(original: undefined | T) => import('./test').WrapObject<T>} */
function wrapFunction(original) {
	if (typeof original !== 'undefined' && typeof original !== 'function') {
		throw new TypeError('`original` must be a function or `undefined`');
	}

	var bound = original && callBind.apply(original);

	/** @type {WrappedCall[]} */
	var calls = [];

	/** @type {import('./test').WrapObject<NonNullable<typeof original>>} */
	var wrapObject = {
		__proto__: null,
		wrapped: /** @type {() => ReturnType<original>} */ function wrapped() {
			var args = $slice(arguments);
			var completed = false;
			try {
				var returned = bound
					// eslint-disable-next-line no-extra-parens
					? bound(this, /** @type {readonly[]} */ (/** @type {unknown} */ (arguments)))
					: void undefined;
				$push(calls, { args: args, receiver: this, returned: returned });
				completed = true;
				return returned;
			} finally {
				if (!completed) {
					$push(calls, { args: args, receiver: this, threw: true });
				}
			}
		},
		calls: calls,
		results: function results() {
			try {
				return calls;
			} finally {
				calls = [];
				wrapObject.calls = calls;
			}
		}
	};
	return wrapObject;
}

/** @type {import('./test').prototype.capture} */
Test.prototype.capture = function capture(obj, method) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new TypeError('`obj` must be an object');
	}
	if (typeof method !== 'string' && typeof method !== 'symbol') {
		throw new TypeError('`method` must be a string or a symbol');
	}
	/** @type {Parameters<wrapFunction>[0]} */
	var implementation = arguments.length > 2 ? arguments[2] : void undefined;
	if (typeof implementation !== 'undefined' && typeof implementation !== 'function') {
		throw new TypeError('`implementation`, if provided, must be a function');
	}

	var wrapper = wrapFunction(implementation);
	var restore = mockProperty(obj, method, { value: wrapper.wrapped });
	this.teardown(restore);

	wrapper.results.restore = restore;

	return wrapper.results;
};

/** @type {import('./test').prototype.captureFn} */
Test.prototype.captureFn = function captureFn(original) {
	if (typeof original !== 'function') {
		throw new TypeError('`original` must be a function');
	}

	var wrapObject = wrapFunction(original);
	wrapObject.wrapped.calls = wrapObject.calls;
	return wrapObject.wrapped;
};

/** @type {import('./test').prototype.intercept} */
Test.prototype.intercept = function intercept(obj, property) {
	if (!obj || (typeof obj !== 'object' && typeof obj !== 'function')) {
		throw new TypeError('`obj` must be an object');
	}
	if (typeof property !== 'string' && typeof property !== 'symbol') {
		throw new TypeError('`property` must be a string or a symbol');
	}
	/** @type {PropertyDescriptor} */
	var desc = arguments.length > 2 ? arguments[2] : { __proto__: null };
	if (typeof desc !== 'undefined' && (!desc || typeof desc !== 'object')) {
		throw new TypeError('`desc`, if provided, must be an object');
	}
	if ('configurable' in desc && !desc.configurable) {
		throw new TypeError('`desc.configurable`, if provided, must be `true`, so that the interception can be restored later');
	}
	var isData = 'writable' in desc || 'value' in desc;
	var isAccessor = 'get' in desc || 'set' in desc;
	if (isData && isAccessor) {
		throw new TypeError('`value` and `writable` can not be mixed with `get` and `set`');
	}
	var strictMode = arguments.length > 3 ? arguments[3] : true;
	if (typeof strictMode !== 'boolean') {
		throw new TypeError('`strictMode`, if provided, must be a boolean');
	}

	/** @type {Call[]} */
	var calls = [];
	var getter = desc.get && callBind.apply(desc.get);
	var setter = desc.set && callBind.apply(desc.set);
	var value = !isAccessor ? desc.value : void undefined;
	var writable = !!desc.writable;

	/** @type {<T = unknown>(this: T, ...args: unknown[]) => unknown} */
	function getInterceptor() {
		/** @type {unknown[]} */
		var args = $slice(arguments);
		if (isAccessor) {
			if (getter) {
				var completed = false;
				try {
					var returned = getter(
						this,
						// eslint-disable-next-line no-extra-parens
						/** @type {readonly []} */ (/** @type {unknown} */ (arguments))
					);
					completed = true;
					$push(calls, { type: 'get', success: true, value: returned, args: args, receiver: this });
					return returned;
				} finally {
					if (!completed) {
						$push(calls, { type: 'get', success: false, threw: true, args: args, receiver: this });
					}
				}
			}
		}
		$push(calls, { type: 'get', success: true, value: value, args: args, receiver: this });
		return value;
	}

	/** @type {<T = unknown>(this: T, v: unknown) => unknown} */
	function setInterceptor(v) {
		var args = $slice(arguments);
		if (isAccessor && setter) {
			var completed = false;
			try {
				// eslint-disable-next-line no-extra-parens
				var returned = setter(this, /** @type {readonly [v: unknown]} */ (/** @type {unknown} */ (arguments)));
				completed = true;
				$push(calls, { type: 'set', success: true, value: v, args: args, receiver: this });
				return returned;
			} finally {
				if (!completed) {
					$push(calls, { type: 'set', success: false, threw: true, args: args, receiver: this });
				}
			}
		}
		var canSet = isAccessor || writable;
		if (canSet) {
			value = v;
		}
		$push(calls, { type: 'set', success: !!canSet, value: value, args: args, receiver: this });

		if (!canSet && strictMode) {
			throw new TypeError('Cannot assign to read only property `' + inspect(property) + '` of object `' + inspect(obj) + '`');
		}
		return value;
	}

	var restore = mockProperty(obj, property, {
		nonEnumerable: !!desc.enumerable,
		get: getInterceptor,
		set: setInterceptor
	});
	this.teardown(restore);

	function results() {
		try {
			return calls;
		} finally {
			calls = [];
		}
	}
	results.restore = restore;

	return results;
};

/** @type {import('./test').prototype._end} */
Test.prototype._end = function _end(err) {
	var self = this;

	if (!this._cb && !this._todo && !this._skip) {
		this.fail('# TODO ' + this.name);
	}

	if (this._progeny.length) {
		var t = $shift(this._progeny);
		t.on('end', function () { self._end(); });
		t.run();
		return;
	}

	function completeEnd() {
		if (!self.ended) { self.emit('end'); }
		var pendingAsserts = self._pendingAsserts();
		if (!self._planError && self._plan !== undefined && pendingAsserts) {
			self._planError = true;
			self.fail('plan != count', {
				expected: self._plan,
				actual: self.assertCount
			});
		}
		self.ended = true;
	}

	function next() {
		if (self._teardown.length === 0) {
			completeEnd();
			return;
		}
		var fn = /** @type {Callback} */ (self._teardown.shift()); // eslint-disable-line no-extra-parens
		var res;
		try {
			res = fn();
		} catch (e) {
			// @ts-expect-error `e` will be stringified
			self.fail(e);
		}
		// eslint-disable-next-line no-extra-parens
		if (res && typeof /** @type {PromiseLike<unknown>} */ (res).then === 'function') {
			/** @type {PromiseLike<unknown>} */
			// eslint-disable-next-line no-extra-parens
			(res).then(next, /** @type {(_err: unknown) => void} */ function (_err) {
				// TODO: wth?
				err = err || _err;
			});
		} else {
			next();
		}
	}

	next();
};

/** @type {import('./test').prototype._exit} */
Test.prototype._exit = function _exit() {
	if (this._plan !== undefined && !this._planError && this.assertCount !== this._plan) {
		this._planError = true;
		this.fail('plan != count', {
			expected: this._plan,
			actual: this.assertCount,
			exiting: true
		});
	} else if (!this.ended) {
		this.fail('test exited without ending: ' + this.name, {
			exiting: true
		});
	}
};

/** @type {import('./test').prototype._pendingAsserts} */
Test.prototype._pendingAsserts = function _pendingAsserts() {
	if (this._plan === undefined) {
		return 1;
	}
	return this._plan - (this._progeny.length + this.assertCount);
};

/** @type {import('./test').prototype._assert} */
Test.prototype._assert = function assert(ok, opts) {
	var self = this;
	var extra = opts.extra || {};

	var actualOK = !!ok || !!extra.skip;

	var name = defined(extra.message, opts.message, '(unnamed assert)');
	if (this.calledEnd && opts.operator !== 'fail') {
		this.fail('.end() already called: ' + name);
		return;
	}

	/** @type {Result} */
	var res = {
		id: self.assertCount++,
		ok: actualOK,
		skip: defined(extra.skip, opts.skip),
		todo: defined(extra.todo, opts.todo, self._todo),
		name: name,
		operator: defined(extra.operator, opts.operator),
		objectPrintDepth: self._objectPrintDepth
	};
	if (hasOwn(opts, 'actual') || hasOwn(extra, 'actual')) {
		res.actual = defined(extra.actual, opts.actual);
	}
	if (hasOwn(opts, 'expected') || hasOwn(extra, 'expected')) {
		res.expected = defined(extra.expected, opts.expected);
	}
	this._ok = !!(this._ok && actualOK);

	if (!actualOK && !res.todo) {
		res.error = defined(extra.error, opts.error, new Error(res.name));
	}

	if (!actualOK) {
		var e = new Error('exception');
		var err = $split(e.stack || '', '\n');
		var tapeDir = __dirname + path.sep;

		for (var i = 0; i < err.length; i++) {
			/*
                Stack trace lines may resemble one of the following.
				We need to correctly extract a function name (if any) and path / line number for each line.

                    at myFunction (/path/to/file.js:123:45)
                    at myFunction (/path/to/file.other-ext:123:45)
                    at myFunction (/path to/file.js:123:45)
                    at myFunction (C:\path\to\file.js:123:45)
                    at myFunction (/path/to/file.js:123)
                    at Test.<anonymous> (/path/to/file.js:123:45)
                    at Test.bound [as run] (/path/to/file.js:123:45)
                    at /path/to/file.js:123:45

                Regex has three parts. First is non-capturing group for 'at ' (plus anything preceding it).

                    /^(?:[^\s]*\s*\bat\s+)/

                Second captures function call description (optional).
				This is not necessarily a valid JS function name, but just what the stack trace is using to represent a function call.
				It may look like `<anonymous>` or 'Test.bound [as run]'.

                For our purposes, we assume that, if there is a function name, it's everything leading up to the first open parentheses (trimmed) before our pathname.

                    /(?:(.*)\s+\()?/

                Last part captures file path plus line no (and optional column no).

                    /((?:[/\\]|[a-zA-Z]:\\)[^:\)]+:(\d+)(?::(\d+))?)\)?/

				In the future, if node supports more ESM URL protocols than `file`, the `file:` below will need to be expanded.
            */
			var re = /^(?:[^\s]*\s*\bat\s+)(?:(.*)\s+\()?((?:[/\\]|[a-zA-Z]:\\|file:\/\/)[^:)]+:(\d+)(?::(\d+))?)\)?$/;
			// first tokenize the PWD, then tokenize tape
			var lineWithTokens = $replace(
				$replace(
					err[i],
					process.cwd(),
					path.sep + '$CWD'
				),
				tapeDir,
				path.sep + '$TEST' + path.sep
			);
			var m = re.exec(lineWithTokens);

			if (!m) {
				continue;
			}

			var callDescription = m[1] || '<anonymous>';
			// first untokenize tape, and then untokenize the PWD, then strip the line/column
			var filePath = $replace(
				$replace(
					$replace(m[2], path.sep + '$TEST' + path.sep, tapeDir),
					path.sep + '$CWD',
					process.cwd()
				),
				/:\d+:\d+$/,
				''
			);

			if ($strSlice(filePath, 0, tapeDir.length) === tapeDir) {
				continue;
			}

			// Function call description may not (just) be a function name.
			// Try to extract function name by looking at first "word" only.
			res.functionName = $split(callDescription, /\s+/)[0];
			res.file = filePath;
			res.line = Number(m[3]);
			if (m[4]) { res.column = Number(m[4]); }

			res.at = callDescription + ' (' + filePath + ':' + res.line + (res.column ? ':' + res.column : '') + ')';
			break;
		}
	}

	self.emit('result', res);

	var pendingAsserts = self._pendingAsserts();
	if (!pendingAsserts) {
		if (extra.exiting) {
			self._end();
		} else {
			nextTick(function () {
				self._end();
			});
		}
	}

	if (!self._planError && pendingAsserts < 0) {
		self._planError = true;
		self.fail('plan != count', {
			expected: self._plan,
			// eslint-disable-next-line no-extra-parens
			actual: /** @type {number} */ (self._plan) - pendingAsserts
		});
	}
};

/** @type {import('./test').prototype.fail} */
Test.prototype.fail = function fail(msg, extra) {
	this._assert(false, {
		message: msg,
		operator: 'fail',
		extra: extra
	});
};

/** @type {import('./test').prototype.pass} */
Test.prototype.pass = function pass(msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'pass',
		extra: extra
	});
};

/** @type {import('./test').prototype.skip} */
Test.prototype.skip = function skip(msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'skip',
		skip: true,
		extra: extra
	});
};

/** @type {import('./test').prototype.ok} */
var testAssert = function assert(value, msg, extra) { // eslint-disable-line func-style
	this._assert(value, {
		message: defined(msg, 'should be truthy'),
		operator: 'ok',
		expected: true,
		actual: value,
		extra: extra
	});
};
Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= testAssert;

/** @type {import('./test').prototype.notOK} */
function notOK(value, msg, extra) {
	this._assert(!value, {
		message: defined(msg, 'should be falsy'),
		operator: 'notOk',
		expected: false,
		actual: value,
		extra: extra
	});
}
Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= notOK;

/** @type {import('./test').prototype.error} */
function error(err, msg, extra) {
	this._assert(!err, {
		message: defined(msg, String(err)),
		operator: 'error',
		error: err,
		extra: extra
	});
}
Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= error;

/** @type {import('./test').prototype.equal} */
function strictEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(is(a, b), {
		message: defined(msg, 'should be strictly equal'),
		operator: 'equal',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= Test.prototype.is
= strictEqual;

/** @type {import('./test').prototype.notEqual} */
function notStrictEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(!is(a, b), {
		message: defined(msg, 'should not be strictly equal'),
		operator: 'notEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.isNotEqual
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNot
= Test.prototype.not
= notStrictEqual;

/** @type {import('./test').prototype.looseEqual} */
function looseEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(a == b, {
		message: defined(msg, 'should be loosely equal'),
		operator: 'looseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}

Test.prototype.looseEqual
= Test.prototype.looseEquals
= looseEqual;

/** @type {import('./test').prototype.notLooseEqual} */
function notLooseEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(a != b, {
		message: defined(msg, 'should not be loosely equal'),
		operator: 'notLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= notLooseEqual;

/** @type {import('./test').prototype.deepEqual} */
function tapeDeepEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should be deeply equivalent'),
		operator: 'deepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= tapeDeepEqual;

/** @type {import('./test').prototype.notDeepEqual} */
function notDeepEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(!deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should not be deeply equivalent'),
		operator: 'notDeepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepEqual
= Test.prototype.notDeepEquals
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= notDeepEqual;

/** @type {import('./test').prototype.deepLooseEqual} */
function deepLooseEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(deepEqual(a, b), {
		message: defined(msg, 'should be loosely deeply equivalent'),
		operator: 'deepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}

Test.prototype.deepLooseEqual
= deepLooseEqual;

/** @type {import('./test').prototype.notDeepLooseEqual} */
function notDeepLooseEqual(a, b, msg, extra) {
	if (arguments.length < 2) {
		throw new TypeError('two arguments must be provided to compare');
	}
	this._assert(!deepEqual(a, b), {
		message: defined(msg, 'should not be loosely deeply equivalent'),
		operator: 'notDeepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepLooseEqual
= notDeepLooseEqual;

/** @type {import('./test').prototype.throws} */
Test.prototype['throws'] = function (fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}

	/** @type {undefined | { error: unknown | Error }} */
	var caught;

	try {
		fn();
	} catch (err) {
		caught = { error: err };
		// @ts-expect-error TS doesn't understand that `Object(err) === err` narrows `err` to `object`
		if (Object(err) === err && 'message' in err && (!isEnumerable(err, 'message') || !hasOwn(err, 'message'))) {
			try {
				var message = err.message;
				delete err.message;
				err.message = message;
			} catch (e) { /**/ }
		}
	}

	/** @type {typeof caught | boolean} */
	var passed = caught;

	if (caught) {
		// eslint-disable-next-line no-extra-parens
		if (typeof expected === 'string' && caught.error && /** @type {Error} */ (caught.error).message === expected) {
			throw new TypeError('The "error/message" argument is ambiguous. The error message ' + inspect(expected) + ' is identical to the message.');
		}
		if (typeof expected === 'function') {
			if (typeof expected.prototype !== 'undefined' && caught.error instanceof expected) {
				passed = true;
			} else if (isErrorConstructor(expected)) {
				passed = false;
			} else {
				passed = expected.call({}, caught.error) === true;
			}
		} else if (isRegExp(expected)) {
			passed = $exec(expected, caught.error) !== null;
			expected = inspect(expected);
		} else if (expected && typeof expected === 'object') { // Handle validation objects.
			if (caught.error && typeof caught.error === 'object') {
				var keys = objectKeys(expected);
				// Special handle errors to make sure the name and the message are compared as well.
				if (expected instanceof Error) {
					$push(keys, 'name', 'message');
				} else if (keys.length === 0) {
					throw new TypeError('`throws` validation object must not be empty');
				}
				// TS TODO: `caught.error` and `expected` should both be `object` here
				passed = every(keys, /** @type {(key: PropertyKey) => boolean} */ function (key) {
					// @ts-expect-error `caught-error` and `expected` are already narrowed to `object`
					if (typeof caught.error[key] === 'string' && isRegExp(expected[key]) && $exec(expected[key], caught.error[key]) !== null) {
						return true;
					}
					// @ts-expect-error `caught.error` and `expected` are already narrowed to `object`
					if (key in caught.error && deepEqual(caught.error[key], expected[key], { strict: true })) {
						return true;
					}
					return false;
				});
			} else {
				passed = false;
			}
		}
	}

	this._assert(!!passed, {
		message: defined(msg, 'should throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: !passed && caught && caught.error,
		extra: extra
	});
};

/** @type {import('./test').prototype.doesNotThrow} */
Test.prototype.doesNotThrow = function doesNotThrow(fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}
	var caught;
	try {
		fn();
	} catch (err) {
		caught = { error: err };
	}
	this._assert(!caught, {
		message: defined(msg, 'should not throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: caught && caught.error,
		extra: extra
	});
};

/** @type {import('./test').prototype.match} */
Test.prototype.match = function match(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'match',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'match',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'matched' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(matches, {
			message: message,
			operator: 'match',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

/** @type {import('./test').prototype.doesNotMatch} */
Test.prototype.doesNotMatch = function doesNotMatch(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'doesNotMatch',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'doesNotMatch',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'was expected to not match' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(!matches, {
			message: message,
			operator: 'doesNotMatch',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

/** @type {import('./test').prototype.assertion} */
Test.prototype.assertion = function assertion(fn) {
	return callBind.apply(fn)(this, $slice(arguments, 1));
};

/** @type {import('./test').skip} */
// eslint-disable-next-line no-unused-vars
Test.skip = function skip(_, _opts, _cb) {
	var args = getTestArgs.apply(null, arguments);
	args.opts.skip = true;
	// eslint-disable-next-line no-extra-parens
	return /** @type {ReturnType<typeof skip>} */ (/** @type {unknown} */ (new Test(args.name, args.opts, args.cb)));
};

module.exports = Test;

// vim: set softtabstop=4 shiftwidth=4:
