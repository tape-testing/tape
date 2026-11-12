'use strict';

var test = require('../../');

test('parent', function (t) {
	t.plan(3);
	t.test('child', function (st) {
		st.ok(true);
	});
});

test('after', function (t) {
	t.ok(true);
	t.end();
});
