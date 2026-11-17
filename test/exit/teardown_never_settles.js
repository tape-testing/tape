'use strict';

var test = require('../../');

test('ended, teardown never settles', function (t) {
	t.teardown(function () {
		return new Promise(function () {});
	});
	t.ok(true);
	t.end();
});

test('not ended, teardown never settles', function (t) {
	t.teardown(function () {
		return new Promise(function () {});
	});
	t.ok(true);
});

test('after', function (t) {
	t.ok(true);
	t.end();
});
