'use strict';

var test = require('../../');

test('async2', async function myTest(t) {
	try {
		t.ok(true, 'before await');
		await new Promise((resolve) => {
			setTimeout(resolve, 10);
		});
		t.ok(false, 'after await');
	} catch (err) {
		t.ifError(err);
	}
});
