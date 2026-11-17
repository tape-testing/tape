'use strict';

var test = require('../../');

test('finished across two beforeExit events', function (t) {
	process.once('beforeExit', function () {
		setTimeout(function () {
			t.ok(true, 'first');
			process.once('beforeExit', function () {
				setTimeout(function () {
					t.ok(true, 'second');
					t.end();
				}, 10);
			});
		}, 10);
	});
});

test('next', function (t) {
	t.ok(true);
	t.end();
});
