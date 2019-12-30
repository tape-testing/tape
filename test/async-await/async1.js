'use strict';

var test = require('../../');

test('async1', async function myTest(t) {
    try {
        t.ok(true, 'before await');
        await new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        t.ok(true, 'after await');
        t.end();
    } catch (err) {
        t.ifError(err);
    }
});
