
var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('plan vs end: plan', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    test.createStream().pipe(concat(function (rows) {
        tt.same(rows.toString('utf8'), [
            'TAP version 13',
            '# first',
            'ok 1 first test',
            'ok 2 t not ended',
            'ok 3 t has progeny',
            '# second',
            'ok 4 second test',
            '# third',
            'ok 5 third test',
            '',
            '1..5',
            '# tests 5',
            '# pass  5',
            '',
            '# ok'
        ].join('\n') + '\n');
    }));

    test('first', function (t) {
        t.plan(4);
        setTimeout(function () {
            t.ok(1, 'first test');
            t.ok(!t.ended, 't not ended');
            t.ok(t._progeny.length, 't has progeny');
        }, 200);

        t.test('second', function (t) {
            t.plan(1);
            t.ok(1, 'second test');
        });
    });

    test('third', function (t) {
        t.plan(1);
        setTimeout(function () {
            t.ok(1, 'third test');
        }, 100);
    });
});

tap.test('plan vs end: end', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    test.createStream().pipe(concat(function (rows) {
        tt.same(rows.toString('utf8'), [
            'TAP version 13',
            '# first',
            'ok 1 first test',
            'ok 2 t not ended',
            'ok 3 t has progeny',
            '# second',
            'ok 4 second test',
            '# third',
            'ok 5 third test',
            '',
            '1..5',
            '# tests 5',
            '# pass  5',
            '',
            '# ok'
        ].join('\n') + '\n');
    }));

    test('first', function (t) {
        setTimeout(function () {
            t.ok(1, 'first test');
            t.ok(!t.ended, 't not ended');
            t.ok(t._progeny.length, 't has progeny');
            t.end();
        }, 200);

        t.test('second', function (t) {
            t.ok(1, 'second test');
            t.end();
        });
    });

    test('third', function (t) {
        setTimeout(function () {
            t.ok(1, 'third test');
            t.end();
        }, 100);
    });
});
