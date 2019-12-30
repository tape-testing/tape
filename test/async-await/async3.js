'use strict';

var test = require('../../');

test('async3', async function myTest(t) {
    t.ok(true, 'before await');
    await new Promise((resolve) => {
        setTimeout(resolve, 10);
    });
    t.ok(true, 'after await');
});
