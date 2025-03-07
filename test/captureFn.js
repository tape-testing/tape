'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var inspect = require('object-inspect');
var forEach = require('for-each');
var v = require('es-value-fixtures');

var stripFullStack = require('./common').stripFullStack;

tap.test('captureFn: output', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var count = 0;
	test.createStream().pipe(concat({ encoding: 'string' }, function (body) {
		tt.same(stripFullStack(body), [].concat(
			// @ts-expect-error TS sucks with concat
			'TAP version 13',
			'# argument validation',
			v.nonFunctions.map(function (x) {
				return 'ok ' + ++count + ' ' + inspect(x) + ' is not a function';
			}),
			'# captured fn calls',
			'ok ' + ++count + ' return value is passed through',
			'ok ' + ++count + ' throwing implementation throws',
			'ok ' + ++count + ' should be deeply equivalent',
			'ok ' + ++count + ' should be deeply equivalent',
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  ' + count,
			'',
			'# ok',
			''
		));
	}));

	test('argument validation', function (t) {
		forEach(v.nonFunctions, function (nonFunction) {
			t.throws(
				// @ts-expect-error
				function () { t.captureFn(nonFunction); },
				TypeError,
				inspect(nonFunction) + ' is not a function'
			);
		});

		t.end();
	});

	test('captured fn calls', function (t) {
		var sentinel = { sentinel: true, inspect: function () { return '{ SENTINEL OBJECT }'; } };

		var wrappedSentinelThunk = t.captureFn(function () { return sentinel; });
		var up = new SyntaxError('foo');
		var wrappedThrower = t.captureFn(function () { throw up; });

		// @ts-expect-error
		t.equal(wrappedSentinelThunk(1, 2), sentinel, 'return value is passed through');
		t.throws(
			function () { wrappedThrower.call(sentinel, 1, 2, 3); },
			SyntaxError,
			'throwing implementation throws'
		);

		t.deepEqual(wrappedSentinelThunk.calls, [
			{ args: [1, 2], receiver: undefined, returned: sentinel }
		]);

		t.deepEqual(wrappedThrower.calls, [
			{ args: [1, 2, 3], receiver: sentinel, threw: true }
		]);

		t.end();
	});
});
