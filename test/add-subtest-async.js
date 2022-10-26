'use strict';

var test = require('../');

test('parent', function (t) {
	t.pass('parent');
	setTimeout(function () {
		t.test('child', function (st) {
			st.pass('child');
			st.end();
		});
	}, 100);
});
