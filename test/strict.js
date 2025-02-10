'use strict';

var tap = require('tap');
var path = require('path');
var exec = require('child_process').exec;

var stripFullStack = require('./common').stripFullStack;
var stripDeprecations = require('./common').stripDeprecations;

var tapeBin = 'node ' + path.join(__dirname, '../bin/tape');

var expectedStackTraceBug = (/^3\.[012]\.\d+$/).test(process.versions.node); // https://github.com/nodejs/node/issues/2581

tap.test(
	'should throw error when --strict is passed via cli and no files are found',
	{ todo: expectedStackTraceBug ? 'Fails on these node versions' : false },
	function (tt) {
		tt.plan(3);

		exec(tapeBin + ' --strict "no*files*found"', { cwd: path.join(__dirname), encoding: 'utf8' }, function (err, stdout, stderr) {
			tt.same(stdout, '');
			tt.match(stripFullStack(stderr).join('\n'), /^No test files found!\n$/);
			tt.equal(/** @type {Error & { code?: number }} */ (err).code, 127);
		});
	}
);

tap.test(
	'should not throw error when --no-strict is passed via cli and no files are found',
	{ todo: expectedStackTraceBug ? 'Fails on these node versions' : false },
	function (tt) {
		tt.plan(3);

		exec(tapeBin + ' --no-strict "no*files*found"', { cwd: path.join(__dirname), encoding: 'utf8' }, function (err, stdout, stderr) {
			tt.equal(stripDeprecations(stderr), '');
			tt.same(stripFullStack(stdout), [
				'TAP version 13',
				'',
				'1..0',
				'# tests 0',
				'# pass  0',
				'',
				'# ok',
				'',
				''
			]);
			tt.equal(err, null); // code 0
		});
	}
);

tap.test(
	'should not throw error when no files are found',
	{ todo: expectedStackTraceBug ? 'Fails on these node versions' : false },
	function (tt) {
		tt.plan(3);

		exec(tapeBin + ' "no*files*found"', { cwd: path.join(__dirname), encoding: 'utf8' }, function (err, stdout, stderr) {
			tt.equal(stripDeprecations(stderr), '');
			tt.same(stripFullStack(stdout), [
				'TAP version 13',
				'',
				'1..0',
				'# tests 0',
				'# pass  0',
				'',
				'# ok',
				'',
				''
			]);
			tt.equal(err, null); // code 0
		});
	}
);
