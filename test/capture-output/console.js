'use strict';

var test = require('../../');

test('capturing console methods', function (t) {
	t.pass('before capturing');

	var log = t.capture(console, 'log');
	var info = t.capture(console, 'info');

	console.log('swallowed');
	console.info('also swallowed');
	t.pass('while capturing');
	t.fail('failure while capturing');

	t.deepEqual(log(), [{ args: ['swallowed'], receiver: console, returned: undefined }], 'user output is captured');
	t.deepEqual(info(), [{ args: ['also swallowed'], receiver: console, returned: undefined }], 'user output is captured');

	log.restore();
	t.pass('after restoring');

	t.end();
});

test('replacing console.log directly', function (t) {
	var original = console.log;
	/** @type {unknown[][]} */
	var calls = [];
	console.log = function () {
		calls[calls.length] = Array.prototype.slice.call(arguments);
	};
	t.teardown(function () {
		console.log = original;
	});

	console.log('replaced');
	t.pass('while replaced');
	t.deepEqual(calls, [['replaced']], 'only user output reaches the replacement');

	t.end();
});
