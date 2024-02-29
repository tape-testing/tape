'use strict';

var defined = require('defined');
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('@ljharb/through');
var resumer = require('@ljharb/resumer');
var inspect = require('object-inspect');
var callBound = require('call-bound');
var hasOwn = require('hasown');

var $exec = callBound('RegExp.prototype.exec');
var $split = callBound('String.prototype.split');
var $replace = callBound('String.prototype.replace');
/** @type {<T>(arr: T[]) => T} */
var $shift = callBound('Array.prototype.shift');
var yamlIndicators = /:|-|\?/;
var nextTick = typeof setImmediate !== 'undefined'
	? setImmediate
	: process.nextTick;

/** @typedef {through.ThroughStream} Stream */
/** @typedef {import('./results').Result} Result */
/** @typedef {import('./test')} Test */
/** @typedef {import('./results')} ResultsType */
/** @typedef {import('../').StreamOptions} StreamOptions */
/** @typedef {import('stream').Writable} WritableStream */

/** @param {string} str */
function coalesceWhiteSpaces(str) {
	return $replace(String(str), /\s+/g, ' ');
}

/** @param {ResultsType} results */
function getNextTest(results) {
	if (!results._only) {
		return $shift(results.tests);
	}

	do {
		var t = $shift(results.tests);
		if (t && results._only === t) {
			return t;
		}
	} while (results.tests.length !== 0);

	return void undefined;
}

/** @param {string} str */
function invalidYaml(str) {
	return $exec(yamlIndicators, str) !== null;
}

/** @type {(res: Result, count: number, todoIsOK?: boolean) => string} */
function encodeResult(res, count, todoIsOK) {
	var output = '';
	output += (res.ok || (todoIsOK && res.todo) ? 'ok ' : 'not ok ') + count;
	output += res.name ? ' ' + coalesceWhiteSpaces(res.name) : '';

	if (res.skip) {
		output += ' # SKIP' + (typeof res.skip === 'string' ? ' ' + coalesceWhiteSpaces(res.skip) : '');
	} else if (res.todo) {
		output += ' # TODO' + (typeof res.todo === 'string' ? ' ' + coalesceWhiteSpaces(res.todo) : '');
	}

	output += '\n';
	if (res.ok) { return output; }

	var outer = '  ';
	var inner = outer + '  ';
	output += outer + '---\n';
	output += inner + 'operator: ' + res.operator + '\n';

	if (hasOwn(res, 'expected') || hasOwn(res, 'actual')) {
		var ex = inspect(res.expected, { depth: res.objectPrintDepth });
		var ac = inspect(res.actual, { depth: res.objectPrintDepth });

		if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
			output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
			output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
		} else {
			output += inner + 'expected: ' + ex + '\n';
			output += inner + 'actual:   ' + ac + '\n';
		}
	}
	if (res.at) {
		output += inner + 'at: ' + res.at + '\n';
	}

	var actualStack = res.actual && (typeof res.actual === 'object' || typeof res.actual === 'function') ? /** @type {Error} */ (res.actual).stack : undefined;
	var errorStack = res.error && /** @type {Error} */ (res.error).stack;
	var stack = defined(actualStack, errorStack);
	if (stack) {
		var lines = $split(String(stack), '\n');
		output += inner + 'stack: |-\n';
		for (var i = 0; i < lines.length; i++) {
			output += inner + '  ' + lines[i] + '\n';
		}
	}

	output += outer + '...\n';
	return output;
}

/**
 * @constructor
 * @param {ConstructorParameters<typeof import('./results')>[0]} [options]
 */
function Results(options) {
	if (!(this instanceof Results)) { return new Results(options); }
	var opts = (arguments.length > 0 ? arguments[0] : options) || {};
	this.count = 0;
	this.fail = 0;
	this.pass = 0;
	this.todo = 0;
	this._stream = through();
	this.tests = [];
	this._only = null;
	this._isRunning = false;
	this.todoIsOK = !!opts.todoIsOK;
}

inherits(Results, EventEmitter);

/** @type {(this: ResultsType, opts?: StreamOptions) => Stream} */
Results.prototype.createStream = function (opts) {
	if (!opts) { opts = {}; }
	var self = this;
	/** @type {Stream} */ var output;
	var testId = 0;
	if (opts.objectMode) {
		output = through();
		self.on('_push', /** @type {(t: Test, extra: unknown) => void} */ function ontest(t, extra) {
			var id = testId++;
			t.once('prerun', function () {
				/** @type {Omit<Result, 'ok' | 'operator' | 'test'> & { parent?: unknown }} */
				var row = {
					type: 'test',
					name: t.name,
					id: id,
					skip: t._skip,
					todo: t._todo
				};
				if (extra && typeof extra === 'object' && 'parent' in extra && hasOwn(extra, 'parent')) {
					row.parent = extra.parent;
				}
				output.queue(row);
			});
			t.on('test', /** @param {Test} st */ function (st) {
				ontest(st, { parent: id });
			});
			t.on('result', /** @param {Result} res */ function (res) {
				if (res && typeof res === 'object') {
					res.test = id;
					res.type = 'assert';
				}
				output.queue(res);
			});
			t.on('end', function () {
				output.queue({ type: 'end', test: id });
			});
		});
		self.on('done', function () { output.queue(null); });
	} else {
		output = resumer();
		output.queue('TAP version 13\n');
		self._stream.pipe(/** @type {NodeJS.WritableStream} */ (output));
	}

	if (!this._isRunning) {
		this._isRunning = true;
		nextTick(function next() {
			var t;
			while (t = getNextTest(self)) {
				t.run();
				if (!t.ended) {
					t.once('end', function () { nextTick(next); });
					return;
				}
			}
			self.emit('done');
		});
	}

	return output;
};

/** @type {import('./results').prototype.push} */
Results.prototype.push = function (t) {
	this.tests[this.tests.length] = t;
	this._watch(t);
	this.emit('_push', t);
};

/** @type {import('./results').prototype.only} */
Results.prototype.only = function (t) {
	this._only = t;
};

/** @type {import('./results').prototype._watch} */
Results.prototype._watch = function (t) {
	var self = this;
	/** @param {string} s */ function write(s) { self._stream.queue(s); }

	t.once('prerun', function () {
		var premsg = '';
		var postmsg = '';
		if (t._skip) {
			premsg = 'SKIP ';
			postmsg = typeof t._skip === 'string' ? ' ' + coalesceWhiteSpaces(t._skip) : '';
		} else if (t._todo) {
			premsg = 'TODO ';
		}
		write('# ' + premsg + coalesceWhiteSpaces(t.name) + postmsg + '\n');
	});

	t.on('result', /** @param {Result | string} res */ function (res) {
		if (typeof res === 'string') {
			write('# ' + res + '\n');
			return;
		}
		write(encodeResult(res, self.count + 1, self.todoIsOK));
		self.count++;

		if (res.ok || res.todo) {
			self.pass++;
		} else {
			self.fail++;
			self.emit('fail');
		}
	});

	t.on('test', /** @param {Test} st */ function (st) { self._watch(st); });
};

/** @type {import('./results').prototype.close} */
Results.prototype.close = function () {
	var self = this;
	if (self.closed) { self._stream.emit('error', new Error('ALREADY CLOSED')); }
	self.closed = true;

	/** @param {string} s */
	function write(s) { self._stream.queue(s); }

	write('\n1..' + self.count + '\n');
	write('# tests ' + self.count + '\n');
	write('# pass  ' + (self.pass + self.todo) + '\n');
	if (self.todo) { write('# todo  ' + self.todo + '\n'); }
	if (self.fail) {
		write('# fail  ' + self.fail + '\n');
	} else {
		write('\n# ok\n');
	}

	self._stream.queue(null);
};

module.exports = Results;
