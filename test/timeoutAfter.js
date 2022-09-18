'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('timeoutAfter test', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var tc = function (rows) {
		tt.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# timeoutAfter',
			'not ok 1 timeoutAfter timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: timeoutAfter timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);
	};

	test.createStream().pipe(concat(tc));

	test('timeoutAfter', function (t) {
		t.plan(1);
		t.timeoutAfter(1);
	});
});

tap.test('timeoutAfter with Promises', { skip: typeof Promise === 'undefined' }, function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var tc = function (rows) {
		tt.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# timeoutAfter with promises',
			'# fulfilled promise',
			'not ok 1 fulfilled promise timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: fulfilled promise timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'# rejected promise',
			'not ok 2 rejected promise timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: rejected promise timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  0',
			'# fail  2',
			''
		]);
	};

	test.createStream().pipe(concat(tc));

	test('timeoutAfter with promises', function (t) {
		t.plan(2);

		t.test('fulfilled promise', function (st) {
			st.plan(1);
			st.timeoutAfter(1);

			return new Promise(function (resolve) {
				setTimeout(function () {
					resolve();
				}, 10);
			});
		});

		t.test('rejected promise', function (st) {
			st.plan(1);
			st.timeoutAfter(1);

			return new Promise(function (reject) {
				setTimeout(function () {
					reject();
				}, 10);
			});
		});
	});
});
