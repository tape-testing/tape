'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;
var testWrapper = require('./anonymous-fn/test-wrapper');

tap.test('inside anonymous functions', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		var body = stripFullStack(rows);

		tt.same(body, [
			'TAP version 13',
			'# wrapped test failure',
			'not ok 1 fail',
			'  ---',
			'    operator: fail',
			'    at: <anonymous> ($TEST/anonymous-fn.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: fail',
			'          [... stack stripped ...]',
			'          at $TEST/anonymous-fn.js:$LINE:$COL',
			'          at Test.<anonymous> ($TEST/anonymous-fn/test-wrapper.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);
	}));

	test('wrapped test failure', testWrapper(function (t) {
		t.fail('fail');
		t.end();
	}));
});
