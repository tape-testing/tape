'use strict';

var tap = require('tap');
var path = require('path');
var execFile = require('child_process').execFile;

var tapeBin = path.join(process.cwd(), 'bin/tape');

tap.test('should allow ignore file together with --ignore-pattern', function (tt) {
	tt.plan(1);
	var proc = execFile(process.execPath, [tapeBin, '--ignore', '.ignore', '--ignore-pattern', 'fake_other_ignored_dir', '**/*.js'], { cwd: path.join(__dirname, 'ignore-pattern') });

	proc.on('exit', function (code) {
		tt.equals(code, 0);
	});
});

tap.test('should allow --ignore-pattern without ignore file', function (tt) {
	tt.plan(1);
	var proc = execFile(process.execPath, [tapeBin, '--ignore-pattern', 'fake_*', '**/*.js'], { cwd: path.join(__dirname, 'ignore-pattern') });

	proc.on('exit', function (code) {
		tt.equals(code, 0);
	});
});

tap.test('should fail if not ignoring', function (tt) {
	tt.plan(1);
	var proc = execFile(process.execPath, [tapeBin, '**/*.js'], { cwd: path.join(__dirname, 'ignore-pattern') });

	proc.on('exit', function (code) {
		tt.equals(code, 1);
	});
});
