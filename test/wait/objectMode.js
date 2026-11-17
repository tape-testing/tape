'use strict';

var tape = require('../../');

tape.wait();

/** @type {unknown[]} */
var rows = [];
tape.createStream({ objectMode: true }).on('data', function (row) {
	rows[rows.length] = row;
}).on('end', function () {
	console.log(JSON.stringify(rows));
});

tape('queued before run', function (t) {
	t.pass();
	t.end();
});

setTimeout(function () {
	tape('queued later', function (t) {
		t.test('subtest', function (st) {
			st.pass();
			st.end();
		});
		t.end();
	});

	tape.run();
}, 10);
