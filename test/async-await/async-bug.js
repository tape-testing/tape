'use strict';

var test = require('../../');

function myCode(arr) {
	let sum = 0;
	// oops forgot to handle null
	for (let i = 0; i < arr.length; i++) {
		sum += arr[i];
	}
	return sum;
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

test('async-error', async function myTest(t) {
	await sleep(100);
	t.ok(true, 'before throw');

	const sum = myCode([1, 2, 3]);
	t.equal(sum, 6);

	const sum2 = myCode(null);
	t.equal(sum2, 0);

	t.end();
});
