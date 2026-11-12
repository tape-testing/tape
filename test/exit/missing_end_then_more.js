'use strict';

var test = require('../../');

test('oops forgot end', function (t) {
	t.ok(true);
});

test('still runs', function (t) {
	t.ok(true);
	t.end();
});
