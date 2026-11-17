'use strict';

var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var path = require('path');

tap.test('an objectMode stream ends when the process exits mid-test', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'objectMode_exit', 'process_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (output) {
		tt.equal(output, 'objectMode stream ended\n');
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		tt.notEqual(code, 0, 'the unfinished test fails the run');
	});
});
