'use strict';

var test = require('../../');

test.createStream({ objectMode: true }).on('end', function () {
	console.log('objectMode stream ended');
});

test('exits mid-test', function (t) {
	t.plan(2);
	t.pass();
	process.exit(0); // eslint-disable-line no-process-exit
});
