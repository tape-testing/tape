var test = require('../');

test('async end', function (t) {
    setTimeout(function () {
        t.assert(!t.ended, '!t.ended');
        t.end();
    }, 200);
});

test('async end with subtest', function (t) {
    setTimeout(function () {
        t.assert(!t.ended, '!t.ended');
        t.end();
    }, 200);

    t.test('subtest', function (g) {
        g.assert(!t.ended, 'subtest !t.ended');
        g.end();
    });
});

