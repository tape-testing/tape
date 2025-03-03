'use strict';

var tap = require('tap');
var tape = require('../');
var through = require('@ljharb/through');

tap.test('test.comment() in objectMode', function (assert) {
	var printer = through();
	/** @type {object[]} */
	var objects = [];
	printer.on('error', /** @param {string} e */ function (e) {
		assert.fail(e);
	});

	printer.write = function (obj) {
		objects.push(/** @type {typeof objects[number]} */ (obj));
		return true;
	};
	printer.end = function (obj) {
		if (obj) { objects.push(/** @type {typeof objects[number]} */ (obj)); }

		assert.equal(objects.length, 3);
		assert.deepEqual(objects, [
			{
				type: 'test',
				name: 'test.comment',
				id: 0,
				skip: false,
				todo: false
			},
			'message',
			{ type: 'end', test: 0 }
		]);
		assert.end();

		return void undefined;
	};

	tape.createStream({ objectMode: true }).pipe(/** @type {NodeJS.WritableStream} */ (printer));

	tape('test.comment', function (test) {
		test.comment('message');
		test.end();
	});
});
