var test = require('blue-tape');

test('first', function (t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            t.ok(1, 'first test');
            resolve();
        }, 200);

        t.test('second', function (t) {
            t.ok(1, 'second test');
        });
    });
});

test('third', function (t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            t.ok(1, 'third test');
            resolve();
        }, 100);
    });
});

test('fourth', function (t) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            t.ok(1, 'fourth test');
            resolve();
        }, 50);
    })

    .then(function () {
        t.test('fifth', function (t) {
            t.ok(1, 'fifth test');
            t.end();
        });
    });
});
