'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var spawn = require('child_process').spawn;
var path = require('path');

tap.test('a harness skips tests made with its `.skip`', function (tt) {
	tt.plan(2);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		tt.equal(output, [
			'TAP version 13',
			'# SKIP skipped',
			'# ran',
			'ok 1 (unnamed assert)',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			''
		].join('\n'));
	}));

	var skipped = test.skip('skipped', function (t) {
		t.fail('should not run');
		t.end();
	});
	tt.ok(skipped instanceof tape.Test, 'returns the skipped test');

	test('ran', function (t) {
		t.pass();
		t.end();
	});
});

tap.test('`tape.skip` reports the skipped test', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'skip_harness', 'default.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (output) {
		tt.equal(output, [
			'TAP version 13',
			'# SKIP skipped',
			'# ran',
			'ok 1 (unnamed assert)',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			'',
			''
		].join('\n'));
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		tt.equal(code, 0);
	});
});
