'use strict';

var test = require('../../');

test('finished from another beforeExit listener', function (t) {
	process.once('beforeExit', function () {
		setTimeout(function () {
			t.ok(true, 'late');
			t.end();
		}, 10);
	});
});

test('next', function (t) {
	t.ok(true);
	t.end();
});
