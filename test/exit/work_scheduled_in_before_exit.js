'use strict';

var test = require('../../');

test('finished after several rounds of beforeExit work', function (t) {
	var rounds = 0;
	process.on('beforeExit', function onBeforeExit() {
		rounds += 1;
		if (rounds < 3) {
			setImmediate(function () {});
		} else {
			process.removeListener('beforeExit', onBeforeExit);
			t.ok(true, 'done');
			t.end();
		}
	});
});

test('next', function (t) {
	t.ok(true);
	t.end();
});
