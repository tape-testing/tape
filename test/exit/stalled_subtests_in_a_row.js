'use strict';

var test = require('../../');

test('parent', function (t) {
	t.test('child', function (st) {
		st.ok(true);
	});
	t.test('child2', function (st) {
		st.ok(true);
	});
});

test('after', function (t) {
	t.ok(true);
	t.end();
});
