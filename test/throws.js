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
    test.createStream().pipe(concat(function (body) {
        tt.same(stripFullStack(body.toString('utf8')), [
            'TAP version 13',
            '# non functions',
            'ok 1 should throw',
            'ok 2 should throw',
            'ok 3 should throw',
            'ok 4 should throw',
            'ok 5 should throw',
            'ok 6 should throw',
            'ok 7 should throw',
            'ok 8 should throw',
            '# function',
            'not ok 9 should throw',
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
            'ok 10 "message" is enumerable',
            "ok 11 { custom: 'error', message: 'message' }",
            'ok 12 getter is still the same',
            '# throws null',
            'ok 13 throws null',
            '# wrong type of error',
            'not ok 14 throws actual',
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
            'ok 15 object properties are validated',
            '# object with regexes',
            'ok 16 object with regex values is validated',
            '# similar error object',
            'ok 17 throwing a similar error',
            '# validate with regex',
            'ok 18 regex against toString of error',
            '# custom error validation',
            'ok 19 error is SyntaxError',
            'ok 20 error matches /value/',
            'ok 21 unexpected error',
            '# throwing primitives',
            'ok 22 primitive: null',
            'ok 23 primitive: undefined',
            'ok 24 primitive: 0',
            'ok 25 primitive: NaN',
            'ok 26 primitive: 42',
            'ok 27 primitive: Infinity',
            'ok 28 primitive: \'\'',
            'ok 29 primitive: \'foo\'',
            'ok 30 primitive: true',
            'ok 31 primitive: false',
            '# ambiguous arguments',
            'ok 32 Second',
            'ok 33 Second',
            'ok 34 Second',
            'ok 35 should throw',
            'not ok 36 should throw',
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
            '',
            '1..36',
            '# tests 36',
            '# pass  33',
            '# fail  3',
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
            t.throws(function () { throw primitive; }, 'primitive: ' + inspect(primitive));
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
});
