'use strict';

var test = require('../');

test('many synchronous sibling subtests do not overflow the stack', function (t) {
	var count = 5000;
	var ran = 0;
	/** @param {import('../lib/test')} st */
	function child(st) {
		ran += 1;
		st.end();
	}
	for (var i = 0; i < count; i++) {
		t.test('child ' + i, child);
	}
	t.test('after all children', function (st) {
		st.equal(ran, count, 'every child ran, in one pass');
		st.end();
	});
	t.end();
});

test('synchronous and asynchronous siblings still run in order', function (t) {
	/** @type {string[]} */
	var order = [];
	t.test('sync 1', function (st) {
		order.push('sync 1');
		st.end();
	});
	t.test('async', function (st) {
		setTimeout(function () {
			order.push('async');
			st.end();
		}, 10);
	});
	t.test('sync 2', function (st) {
		order.push('sync 2');
		st.end();
	});
	t.test('nested', function (st) {
		st.test('nested sync', function (s2t) {
			order.push('nested sync');
			s2t.end();
		});
		st.test('nested async', function (s2t) {
			setTimeout(function () {
				order.push('nested async');
				s2t.end();
			}, 10);
		});
		st.end();
	});
	t.test('check', function (st) {
		st.deepEqual(order, ['sync 1', 'async', 'sync 2', 'nested sync', 'nested async'], 'siblings run one at a time, in order');
		st.end();
	});
	t.end();
});
