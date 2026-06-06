'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

var ran = 0;

tap.test('timeout with multiple tests', function (tt) {
	tt.plan(0);

	var test = tape.createHarness();

	test('timeout', function (t) {
		t.pass('this should run');
		ran++;
		setTimeout(function () {
			t.end();
		}, 100);
	});

	test('should still run', { timeout: 50 }, function (t) {
		t.equal(ran, 1);
		t.end();
	});
});

tap.test('timeout with blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# timeout',
			'not ok 1 timeout timed out after 2ms',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/timeout.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: timeout timed out after 2ms',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/timeout.js:$LINE:$COL)',
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

	test('timeout', { timeout: 1 }, function (t) {
		var start = Date.now();
		while (Date.now() < start + 2) {
			// Busy-wait to block the event loop
		}
		t.end();
	});
});
