var test = require('../../');

test('async2', async function myTest(t) {
    try {
        t.ok(true, 'before await');
        await new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        t.ok(false, 'after await');
        t.end();
    } catch (err) {
        t.ifError(err);
        t.end();
    }
});
