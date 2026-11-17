'use strict';

var test = require('../../');

process.on('uncaughtException', function () {});

test('parent', function (t) {
	t.test('child', function () {
		throw new Error('boom');
	});
	t.test('sibling', function (st) {
		st.pass();
		st.end();
	});
	// end the parent before tape starts its subtests on its own, so that the child throws from inside the parent's `end()`
	process.nextTick(function () {
		t.end();
	});
});

test('next', function (t) {
	t.pass();
	t.end();
});
