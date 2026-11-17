'use strict';

var test = require('../../');

/** @type {import('../../').Test | undefined} */
var current;

process.on('beforeExit', function () {
	if (current) {
		current.ok(true, 'checked');
	}
});

test('asserts from a listener added before tape\'s', function (t) {
	current = t;
});

test('after', function (t) {
	current = undefined;
	t.ok(true);
	t.end();
});
