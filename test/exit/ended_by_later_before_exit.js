'use strict';

var test = require('../../');

test('ended by a later beforeExit listener', function (t) {
	process.once('beforeExit', function () {
		setTimeout(function () {
			process.once('beforeExit', function () {
				t.ok(true, 'done');
				t.end();
			});
		}, 10);
	});
});

test('next', function (t) {
	t.ok(true);
	t.end();
});
