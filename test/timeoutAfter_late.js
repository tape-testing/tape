'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('a timed-out test that finishes late names itself, and does not fail the next test', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# takes too long',
			'not ok 1 takes too long timed out after 10ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: takes too long timed out after 10ms',
			'          [... stack stripped ...]',
			'  ...',
			'# next test',
			'not ok 2 assertion after test timed out (takes too long): late',
			'  ---',
			'    operator: fail',
			'    at: finish ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: assertion after test timed out (takes too long): late',
			'          [... stack stripped ...]',
			'          at finish ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'          at Test.<anonymous> ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 3 own assertion',
			'',
			'1..3',
			'# tests 3',
			'# pass  1',
			'# fail  2',
			''
		]);
	}));

	/** @type {() => void} */
	var finishLate;

	test('takes too long', function (t) {
		t.timeoutAfter(10);
		finishLate = function finish() {
			t.pass('late');
			t.end();
		};
	});

	test('next test', function (t) {
		finishLate();
		t.pass('own assertion');
		t.end();
	});
});

tap.test('a late assertion from a timed-out test with a plan does not also report `plan != count`', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# planned',
			'not ok 1 planned timed out after 10ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: planned timed out after 10ms',
			'          [... stack stripped ...]',
			'  ...',
			'# next test',
			'not ok 2 assertion after test timed out (planned): late',
			'  ---',
			'    operator: fail',
			'    at: late ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: assertion after test timed out (planned): late',
			'          [... stack stripped ...]',
			'          at late ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'          at Test.<anonymous> ($TEST/timeoutAfter_late.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 3 own assertion',
			'',
			'1..3',
			'# tests 3',
			'# pass  1',
			'# fail  2',
			''
		]);
	}));

	/** @type {() => void} */
	var assertLate;

	test('planned', function (t) {
		t.plan(1);
		t.timeoutAfter(10);
		assertLate = function late() {
			t.pass('late');
		};
	});

	test('next test', function (t) {
		assertLate();
		t.pass('own assertion');
		t.end();
	});
});
