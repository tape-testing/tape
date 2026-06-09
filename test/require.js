'use strict';

var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var stripFullStack = require('./common').stripFullStack;

/** @param {string} args */
function tape(args) {
	var bin = __dirname + '/../bin/tape';

	return spawn(process.execPath, [bin].concat(args.split(' ')), { cwd: __dirname });
}

tap.test('requiring a single module', function (t) {
	t.plan(2);

	var ps = tape('-r ./require/a require/test-a.js');
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# module-a',
			'ok 1 loaded module a',
			'# test-a',
			'ok 2 module-a loaded in same context',
			'ok 3 test ran after module-a was loaded',
			'',
			'1..3',
			'# tests 3',
			'# pass  3',
			'',
			'# ok',
			'',
			''
		]);
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});

tap.test('requiring multiple modules', function (t) {
	t.plan(2);

	var ps = tape('-r ./require/a -r ./require/b require/test-a.js require/test-b.js');
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(rows, [
			'TAP version 13',
			'# module-a',
			'ok 1 loaded module a',
			'# module-b',
			'ok 2 loaded module b',
			'# test-a',
			'ok 3 module-a loaded in same context',
			'ok 4 test ran after module-a was loaded',
			'# test-b',
			'ok 5 module-b loaded in same context',
			'ok 6 test ran after module-b was loaded',
			'',
			'1..6',
			'# tests 6',
			'# pass  6',
			'',
			'# ok'
		].join('\n') + '\n\n');
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});
