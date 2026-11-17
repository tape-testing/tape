'use strict';

var test = require('../../');

test('subtest ends its parent', function (t) {
	t.test('child', function (st) {
		st.ok(true);
		t.end();
	});
});

test('subtest added after its parent ended', function (t) {
	t.ok(true);
	t.end();
	setTimeout(function () {
		t.test('late child', function (st) {
			st.ok(true);
		});
	}, 10);
});

test('after', function (t) {
	t.ok(true);
	t.end();
});
