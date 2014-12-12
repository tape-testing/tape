var test = require('../');

test('parent', function (t) {
    t.plan(3)

    var firstChildRan = false;

    t.ok(true, 'assertion in parent');

    t.test('first child', function (t) {
        t.plan(1);
        t.ok(true, 'pass first child');
        firstChildRan = true;
    });

    t.test('second child', function (t) {
        t.plan(2);
        t.ok(firstChildRan, 'first child ran first');
        t.ok(true, 'pass second child');
    });
});
