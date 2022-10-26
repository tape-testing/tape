'use strict';

var test = require('../../');

if (typeof Promise === 'function' && typeof Promise.resolve === 'function') {
	test('promise', function () {
		return new Promise(function (resolve, reject) {
			reject(new Error('rejection message'));
		});
	});

	test('after', function (t) {
		t.plan(1);
		t.ok(true);
	});
} else {
	// if promises aren't supported pass the node-tap test
	console.log('skip');
}
