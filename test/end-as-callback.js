'use strict';

var tap = require('tap');
var forEach = require('for-each');
var tape = require('../');
var concat = require('concat-stream');

/**
 * extract the stack trace for the failed test.
 * this will change dependent on the environment
 * so no point hard-coding it in the test assertion
 * see: https://git.io/v6hGG for example
 * @param {string} rows - the tap output lines
 * @returns {string} stacktrace - just the error stack part
 */
function getStackTrace(rows) {
	var stacktrace = '  ---\n';
	var extract = false;
	forEach(rows.split('\n'), function (row) {
		if (!extract) {
			if (row.indexOf('---') > -1) { // start of stack trace
				extract = true;
			}
		} else if (row.indexOf('...') > -1) { // end of stack trace
			extract = false;
			stacktrace += '  ...';
		} else {
			stacktrace += row + '\n';
		}
	});
	// console.log(stacktrace);
	return stacktrace;
}

/** @param {string} name @param {(err: unknown, data?: string) => void} cb*/
function fakeAsyncTask(name, cb) {
	cb(null, 'task' + name);
}

/** @param {string} _name @param {(err: unknown, data?: string) => void} cb*/
function fakeAsyncWrite(_name, cb) {
	cb(null);
}

/** @param {string} _name @param {(err: unknown, data?: string) => void} cb*/
function fakeAsyncWriteFail(_name, cb) {
	cb(new Error('fail'));
}

tap.test('tape assert.end as callback', function (tt) {
	var test = tape.createHarness({ exit: false });

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.equal(rows, [
			'TAP version 13',
			'# do a task and write',
			'ok 1 null',
			'ok 2 should be strictly equal',
			'# do a task and write fail',
			'ok 3 null',
			'ok 4 should be strictly equal',
			'not ok 5 Error: fail',
			getStackTrace(rows), // tap error stack
			'',
			'1..5',
			'# tests 5',
			'# pass  4',
			'# fail  1'
		].join('\n') + '\n');
		tt.end();
	}));

	test('do a task and write', function (assert) {
		fakeAsyncTask('foo', function (err, value) {
			assert.ifError(err);
			assert.equal(value, 'taskfoo');

			fakeAsyncWrite('bar', assert.end);
		});
	});

	test('do a task and write fail', function (assert) {
		fakeAsyncTask('bar', function (err, value) {
			assert.ifError(err);
			assert.equal(value, 'taskbar');

			fakeAsyncWriteFail('baz', assert.end);
		});
	});
});
