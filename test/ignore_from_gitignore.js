'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

var tapeBin = path.join(process.cwd(), 'bin/tape');

/** @typedef {(code: number) => void} ExitHandler */

tap.test('Should pass with ignoring', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [tapeBin, '**/*.js', '-i', '.ignore'], { cwd: path.join(__dirname, 'ignore') });
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# (anonymous)',
			'ok 1 should be truthy',
			'# (anonymous)',
			'ok 2 test/stub1',
			'# (anonymous)',
			'ok 3 test/stub2',
			'# (anonymous)',
			'ok 4 test/sub/stub1',
			'# (anonymous)',
			'ok 5 test/sub/stub2',
			'# (anonymous)',
			'ok 6 Should print',
			'',
			'1..6',
			'# tests 6',
			'# pass  6',
			'',
			'# ok',
			'',
			''
		]);
	}));
	ps.on('exit', /** @type {ExitHandler} */ function (code) {
		tt.equal(code, 0); // code 0
	});
});

tap.test('Should pass', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [tapeBin, '**/*.js'], { cwd: path.join(__dirname, 'ignore') });
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# (anonymous)',
			'not ok 1 Should not print',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/ignore/fake_node_modules/stub1.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: Should not print',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/ignore/fake_node_modules/stub1.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# (anonymous)',
			'not ok 2 Should not print',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/ignore/fake_node_modules/stub2.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: Should not print',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/ignore/fake_node_modules/stub2.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'# (anonymous)',
			'ok 3 should be truthy',
			'# (anonymous)',
			'ok 4 test/stub1',
			'# (anonymous)',
			'ok 5 test/stub2',
			'# (anonymous)',
			'ok 6 test/sub/stub1',
			'# (anonymous)',
			'ok 7 test/sub/stub2',
			'# (anonymous)',
			'ok 8 Should print',
			'',
			'1..8',
			'# tests 8',
			'# pass  6',
			'# fail  2',
			'',
			''
		]);
	}));
	ps.on('exit', /** @type {ExitHandler} */ function (code) {
		tt.equal(code, 1);
	});
});

tap.test('Should fail when ignore file does not exist', function (tt) {
	tt.plan(3);

	var ps = spawn(process.execPath, [tapeBin, '**/*.js', '-i'], { cwd: path.join(__dirname, 'ignore') });
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(rows, '');
	}));
	ps.stderr.pipe(concat({ encoding: 'string' }, function (rows) {
		tt.ok((/^ENOENT[:,] no such file or directory,? (?:open )?'\$TEST\/ignore\/.gitignore'\n$/m).test(stripFullStack(rows).join('\n')));
	}));
	ps.on('exit', /** @type {ExitHandler} */ function (code) {
		tt.equal(code, 2);
	});
});
