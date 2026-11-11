'use strict';

var test = require('../../');

test('too few', function (t) {
	t.plan(2);
	t.ok(true);
});

test('still runs', function (t) {
	t.plan(1);
	t.ok(true);
});
