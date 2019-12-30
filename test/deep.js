'use strict';

var test = require('../');

test('deep strict equal', function (t) {
    t.notDeepEqual(
        [ { a: '3' } ],
        [ { a: 3 } ]
    );
    t.end();
});

test('deep loose equal', function (t) {
    t.deepLooseEqual(
        [ { a: '3' } ],
        [ { a: 3 } ]
    );
    t.end();
});

test('requires 2 arguments', function (t) {
    var err = /^TypeError: two arguments must be provided/;
    t.throws(function () { t.deepEqual(); }, err, 'deepEqual: no args');
    t.throws(function () { t.deepEqual(undefined); }, err, 'deepEqual: one arg');
    t.throws(function () { t.deepLooseEqual(); }, err, 'deepLooseEqual: no args');
    t.throws(function () { t.deepLooseEqual(undefined); }, err, 'deepLooseEqual: one arg');
    t.throws(function () { t.notDeepEqual(); }, err, 'notDeepEqual: no args');
    t.throws(function () { t.notDeepEqual(undefined); }, err, 'notDeepEqual: one arg');
    t.throws(function () { t.notDeepLooseEqual(); }, err, 'notDeepLooseEqual: no args');
    t.throws(function () { t.notDeepLooseEqual(undefined); }, err, 'notDeepLooseEqual: one arg');
    t.throws(function () { t.equal(); }, err, 'equal: no args');
    t.throws(function () { t.equal(undefined); }, err, 'equal: one arg');
    t.throws(function () { t.notEqual(); }, err, 'notEqual: no args');
    t.throws(function () { t.notEqual(undefined); }, err, 'notEqual: one arg');

    t.end();
});
