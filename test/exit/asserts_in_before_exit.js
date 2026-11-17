'use strict';

var test = require('../../');

test('asserts whenever the event loop empties', function (t) {
	process.on('beforeExit', function () {
		t.ok(true, 'checked');
	});
});

test('after', function (t) {
	t.ok(true);
	t.end();
});
