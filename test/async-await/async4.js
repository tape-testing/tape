'use strict';

var test = require('../../');

test('async4', async function myTest(t) {
    try {
        t.ok(true, 'before await');
        await new Promise((resolve, reject) => {
            setTimeout(function myTimeout() {
                reject(new Error('oops'));
            }, 10);
        });
        t.ok(true, 'after await');
    } catch (err) {
        t.ifError(err);
    }
});
