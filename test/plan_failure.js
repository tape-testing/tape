'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('one plan with end fails, next plan succeeds', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var count = 0;
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [].concat(
			'TAP version 13',
			'# failed plan',
			'not ok ' + ++count + ' plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 1',
			'    actual:   0',
			'    at: Test.<anonymous> ($TEST/plan_failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/plan_failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# still called',
			'# ------------ called?',
			'ok ' + ++count + ' passes!',
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  1',
			'# fail  1',
			''
		));
	}));

	test('failed plan', function (t) {
		t.plan(1);
		t.end();
	});

	test('still called', function (t) {
		t.comment('------------ called?');
		t.plan(1);
		t.pass('passes!');
	});
});

tap.test('one plan without end fails, next plan succeeds', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var count = 0;
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [].concat(
			'TAP version 13',
			'# failed plan',
			'not ok ' + ++count + ' plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 1',
			'    actual:   0',
			'    at: Test.<anonymous> ($TEST/plan_failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/plan_failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# still called',
			'# ------------ called?',
			'ok ' + ++count + ' passes!',
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  1',
			'# fail  1',
			''
		));
	}));

	test('failed plan', function (t) {
		t.plan(1);
	});

	test('still called', function (t) {
		t.comment('------------ called?');
		t.plan(1);
		t.pass('passes!');
	});
});
