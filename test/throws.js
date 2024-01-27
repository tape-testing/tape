'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var inspect = require('object-inspect');
var assign = require('object.assign');

var stripFullStack = require('./common').stripFullStack;

var getter = function () { return 'message'; };
var messageGetterError = Object.defineProperty(
	{ custom: 'error' },
	'message',
	{
		configurable: true,
		enumerable: true,
		get: getter
	}
);
var thrower = function () { throw messageGetterError; };

tap.test('failures', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var count = 0;
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# non functions',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'ok ' + ++count + ' should throw',
			'# function',
			'not ok ' + ++count + ' should throw',
			'  ---',
			'    operator: throws',
			'    expected: undefined',
			'    actual:   undefined',
			'    at: Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should throw',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# custom error messages',
			'ok ' + ++count + ' "message" is enumerable',
			'ok ' + ++count + ' { custom: \'error\', message: \'message\' }',
			'ok ' + ++count + ' getter is still the same',
			'# throws null',
			'ok ' + ++count + ' throws null',
			'# wrong type of error',
			'not ok ' + ++count + ' throws actual',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      [Function: TypeError]',
			'    actual: |-',
			"      { [RangeError: actual!] message: 'actual!' }",
			'    at: Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'    stack: |-',
			'      RangeError: actual!',
			'          at Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# object',
			'ok ' + ++count + ' object properties are validated',
			'# object with regexes',
			'ok ' + ++count + ' object with regex values is validated',
			'# similar error object',
			'ok ' + ++count + ' throwing a similar error',
			'# validate with regex',
			'ok ' + ++count + ' regex against toString of error',
			'# custom error validation',
			'ok ' + ++count + ' error is SyntaxError',
			'ok ' + ++count + ' error matches /value/',
			'ok ' + ++count + ' unexpected error',
			'# throwing primitives',
			'ok ' + ++count + ' primitive: null, no expected',
			'not ok ' + ++count + ' primitive: null, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      null',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: undefined, no expected',
			'not ok ' + ++count + ' primitive: undefined, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      undefined',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: primitive: undefined, with non-empty expected object',
			'          [... stack stripped ...]',
			'          at $TEST/throws.js:$LINE:$COL',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok ' + ++count + ' primitive: 0, no expected',
			'not ok ' + ++count + ' primitive: 0, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      0',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: NaN, no expected',
			'not ok ' + ++count + ' primitive: NaN, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      NaN',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: 42, no expected',
			'not ok ' + ++count + ' primitive: 42, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      42',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: Infinity, no expected',
			'not ok ' + ++count + ' primitive: Infinity, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      Infinity',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: \'\', no expected',
			'not ok ' + ++count + ' primitive: \'\', with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      \'\'',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: \'foo\', no expected',
			'not ok ' + ++count + ' primitive: \'foo\', with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      \'foo\'',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: true, no expected',
			'not ok ' + ++count + ' primitive: true, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      true',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'ok ' + ++count + ' primitive: false, no expected',
			'not ok ' + ++count + ' primitive: false, with non-empty expected object',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { a: \'b\' }',
			'    actual: |-',
			'      false',
			'    at: <anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'# ambiguous arguments',
			'ok ' + ++count + ' Second',
			'ok ' + ++count + ' Second',
			'ok ' + ++count + ' Second',
			'ok ' + ++count + ' should throw',
			'not ok ' + ++count + ' should throw',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      \'/Second$/\'',
			'    actual: |-',
			'      { [Error: First] message: \'First\' }',
			'    at: Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: First',
			'          at throwingFirst ($TEST/throws.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# non-extensible throw match',
			'ok ' + ++count + ' error is non-extensible',
			'ok ' + ++count + ' non-extensible error matches',
			'ok ' + ++count + ' errorWithMessage is non-extensible',
			'not ok ' + ++count + ' non-extensible error with message matches',
			'  ---',
			'    operator: throws',
			'    expected: |-',
			'      { foo: 1 }',
			'    actual: |-',
			'      { message: \'abc\' }',
			'    at: Test.<anonymous> ($TEST/throws.js:$LINE:$COL)',
			'  ...',
			'# frozen `message` property',
			'ok ' + ++count + ' error is non-writable',
			'ok ' + ++count + ' error is non-configurable',
			'ok ' + ++count + ' non-writable error matches',
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  39',
			'# fail  ' + (count - 39),
			''
		]);
	}));

	test('non functions', function (t) {
		t.plan(8);
		t.throws();
		t.throws(null);
		t.throws(true);
		t.throws(false);
		t.throws('abc');
		t.throws(/a/g);
		t.throws([]);
		t.throws({});
	});

	test('function', function (t) {
		t.plan(1);
		t.throws(function () {});
	});

	test('custom error messages', function (t) {
		t.plan(3);
		t.equal(Object.prototype.propertyIsEnumerable.call(messageGetterError, 'message'), true, '"message" is enumerable');
		t.throws(thrower, "{ custom: 'error', message: 'message' }");
		t.equal(Object.getOwnPropertyDescriptor(messageGetterError, 'message').get, getter, 'getter is still the same');
	});

	test('throws null', function (t) {
		t.plan(1);
		t.throws(function () { throw null; }, 'throws null');
		t.end();
	});

	test('wrong type of error', function (t) {
		t.plan(1);
		var actual = new RangeError('actual!');
		t.throws(function () { throw actual; }, TypeError, 'throws actual');
		t.end();
	});

	// taken from https://nodejs.org/api/assert.html#assert_assert_throws_fn_error_message
	var err = new TypeError('Wrong value');
	err.code = 404;
	err.foo = 'bar';
	err.info = {
		nested: true,
		baz: 'text'
	};
	err.reg = /abc/i;

	test('object', function (t) {
		t.plan(1);

		t.throws(
			function () { throw err; },
			{
				name: 'TypeError',
				message: 'Wrong value',
				info: {
					nested: true,
					baz: 'text'
				}
				// Only properties on the validation object will be tested for.
				// Using nested objects requires all properties to be present. Otherwise
				// the validation is going to fail.
			},
			'object properties are validated'
		);

		t.end();
	});

	test('object with regexes', function (t) {
		t.plan(1);
		t.throws(
			function () { throw err; },
			{
				// The `name` and `message` properties are strings and using regular
				// expressions on those will match against the string. If they fail, an
				// error is thrown.
				name: /^TypeError$/,
				message: /Wrong/,
				foo: 'bar',
				info: {
					nested: true,
					// It is not possible to use regular expressions for nested properties!
					baz: 'text'
				},
				// The `reg` property contains a regular expression and only if the
				// validation object contains an identical regular expression, it is going
				// to pass.
				reg: /abc/i
			},
			'object with regex values is validated'
		);
		t.end();
	});

	test('similar error object', function (t) {
		t.plan(1);
		t.throws(
			function () {
				var otherErr = new TypeError('Not found');
				// Copy all enumerable properties from `err` to `otherErr`.
				assign(otherErr, err);
				throw otherErr;
			},
			// The error's `message` and `name` properties will also be checked when using
			// an error as validation object.
			err,
			'throwing a similar error'
		);
		t.end();
	});

	test('validate with regex', function (t) {
		t.plan(1);
		t.throws(
			function () { throw new Error('Wrong value'); },
			/^Error: Wrong value$/,
			'regex against toString of error'
		);
		t.end();
	});

	test('custom error validation', function (t) {
		t.plan(3);
		t.throws(
			function () { throw new SyntaxError('Wrong value'); },
			function (error) {
				t.ok(error instanceof SyntaxError, 'error is SyntaxError');
				t.ok((/value/).test(error), 'error matches /value/');
				// Avoid returning anything from validation functions besides `true`.
				// Otherwise, it's not clear what part of the validation failed. Instead,
				// throw an error about the specific validation that failed (as done in this
				// example) and add as much helpful debugging information to that error as
				// possible.
				return true;
			},
			'unexpected error'
		);
		t.end();
	});

	test('throwing primitives', function (t) {
		[null, undefined, 0, NaN, 42, Infinity, '', 'foo', true, false].forEach(function (primitive) {
			t.throws(function () { throw primitive; }, 'primitive: ' + inspect(primitive) + ', no expected');
			t.throws(function () { throw primitive; }, { a: 'b' }, 'primitive: ' + inspect(primitive) + ', with non-empty expected object');
		});

		t.end();
	});

	test('ambiguous arguments', function (t) {
		function throwingFirst() {
			throw new Error('First');
		}

		function throwingSecond() {
			throw new Error('Second');
		}

		function notThrowing() {}

		// The second argument is a string and the input function threw an Error.
		// The first case will not throw as it does not match for the error message
		// thrown by the input function!
		t.throws(throwingFirst, 'Second');
		// In the next example the message has no benefit over the message from the
		// error and since it is not clear if the user intended to actually match
		// against the error message, Node.js throws an `ERR_AMBIGUOUS_ARGUMENT` error.
		t.throws(throwingSecond, 'Second');
		// TypeError [ERR_AMBIGUOUS_ARGUMENT]

		// The string is only used (as message) in case the function does not throw:
		t.doesNotThrow(notThrowing, 'Second');
		// AssertionError [ERR_ASSERTION]: Missing expected exception: Second

		// If it was intended to match for the error message do this instead:
		// It does not fail because the error messages match.
		t.throws(throwingSecond, /Second$/);

		// If the error message does not match, an AssertionError is thrown.
		t.throws(throwingFirst, /Second$/);
		// AssertionError [ERR_ASSERTION]
		t.end();
	});

	test('non-extensible throw match', { skip: !Object.seal }, function (t) {
		var error = { foo: 1 };
		Object.seal(error);
		t.throws(function () { error.x = 1; }, TypeError, 'error is non-extensible');

		t.throws(function () { throw error; }, error, 'non-extensible error matches');

		var errorWithMessage = { message: 'abc' };
		Object.seal(errorWithMessage);
		t.throws(function () { errorWithMessage.x = 1; }, TypeError, 'errorWithMessage is non-extensible');

		t.throws(function () { throw errorWithMessage; }, error, 'non-extensible error with message matches');

		t.end();
	});

	test('frozen `message` property', { skip: !Object.defineProperty }, function (t) {
		var error = { message: 'abc' };
		Object.defineProperty(error, 'message', { configurable: false, enumerable: false, writable: false });

		t.throws(function () { error.message = 'def'; }, TypeError, 'error is non-writable');
		t.throws(function () { delete error.message; }, TypeError, 'error is non-configurable');

		t.throws(function () { throw error; }, { message: 'abc' }, 'non-writable error matches');

		t.end();
	});
});
