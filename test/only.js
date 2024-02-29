'use strict';

var tap = require('tap');
var tape = require('../');
var concat = require('concat-stream');

tap.test('tape only test', function (tt) {
	var test = tape.createHarness({ exit: false });
	/** @type {number[]} */
	var ran = [];

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.deepEqual(rows.split('\n'), [
			'TAP version 13',
			'# run success',
			'ok 1 assert name',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			''
		]);
		tt.deepEqual(ran, [3]);

		tt.end();
	}));

	test('never run fail', function (t) {
		ran.push(1);
		t.equal(true, false);
		t.end();
	});

	test('never run success', function (t) {
		ran.push(2);
		t.equal(true, true);
		t.end();
	});

	test.only('run success', function (t) {
		ran.push(3);
		t.ok(true, 'assert name');
		t.end();
	});
});

tap.test('created harness with no conf', function (tt) {
	var harness = tape.createHarness();

	tt.doesNotThrow(function () { harness.only({ skip: true }); }, 'harness.only does not throw with omitted harness conf arg');

	tt.end();
});
