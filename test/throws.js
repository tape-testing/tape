var test = require('../');

function fn() {
    throw new TypeError('Something bad happened!');
}

test('throws', function (t) {
    t.throws(fn);
    t.end();
});

test('throws (RegExp match)', function (t) {
    t.throws(fn, /^Something bad happened!$/);
    t.end();
});

test('throws (Function match)', function (t) {
    t.throws(fn, TypeError);
    t.end();
});
