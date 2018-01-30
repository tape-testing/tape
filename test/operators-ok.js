var test = require('../');

test('t.lessThan ok', function (t) {
    t.lessThan(1, 2);
    t.end();
});

test('t.lt ok', function (t) {
    t.lt(1, 2);
    t.end();
});

test('t.greaterThan ok', function (t) {
    t.greaterThan(2, 1);
    t.end();
});

test('t.gt ok', function (t) {;
    t.gt(2, 1);
    t.end();
});

test('t.lessThanOrEqual ok', function (t) {
    t.lessThanOrEqual(1, 1);
    t.lessThanOrEqual(1, 2);
    t.end();
});

test('t.lte ok', function (t) {
    t.lte(1, 1);
    t.lte(1, 2);
    t.end();
});

test('t.greaterThanOrEqual ok', function (t) {
    t.greaterThanOrEqual(1, 1);
    t.greaterThanOrEqual(2, 1);
    t.end();
});

test('t.gte ok', function (t) {
    t.gte(1, 1);
    t.gte(2, 1);
    t.end();
});
