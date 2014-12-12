var test = require('../');

test('parent test', function (t) {
    t.plan(2);
    t.test('first child', function (t) {
        t.plan(1);
        t.ok(true, 'pass first child');
    })

    t.test(function (t) {
        t.plan(1);
        t.ok(true, 'pass second child');
    })
})
