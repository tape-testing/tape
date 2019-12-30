'use strict';

var test = require('../../');

test('async-error', async function myTest(t) {
    t.ok(true, 'before throw');
    throw new Error('oopsie');
    t.ok(true, 'after throw');
});
