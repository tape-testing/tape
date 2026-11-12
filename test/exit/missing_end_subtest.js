'use strict';

var test = require('../../');

test('parent', function (t) {
	t.test('child forgot end', function (st) {
		st.ok(true);
	});

	t.test('sibling still runs', function (st) {
		st.ok(true);
		st.end();
	});
});

test('next test still runs', function (t) {
	t.ok(true);
	t.end();
});
