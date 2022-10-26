'use strict';

var test = require('../../');

test('async-error', async function myTest(t) {
	t.ok(true, 'before throw');
	throw new Error('oopsie');
	/* eslint no-unreachable: 0 */
	t.ok(true, 'after throw');
});
