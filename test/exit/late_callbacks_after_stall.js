'use strict';

var test = require('../../');

/** @type {() => void} */
var finishLate;

test('stalls, then finishes late', function (t) {
	finishLate = function finish() {
		t.ok(true, 'late');
		t.end();
	};
});

test('next', function (t) {
	finishLate();
	t.ok(true);
	t.end();
});
