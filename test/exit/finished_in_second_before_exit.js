'use strict';

var test = require('../../');

test('finished from a beforeExit listener added in a later round', function (t) {
	process.once('beforeExit', function () {
		setImmediate(function () {
			process.once('beforeExit', function () {
				t.ok(true, 'late');
				t.end();
			});
		});
	});
});

test('next', function (t) {
	t.ok(true);
	t.end();
});
