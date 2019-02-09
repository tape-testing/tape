var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var stripFullStack = require('./common').stripFullStack;

tap.test('nested sync test without plan or end', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# nested without plan or end',
            'not ok 1 test timed out after 100ms',
            '  ---',
            '    operator: fail',
            '    stack: |-',
            '      Error: test timed out after 100ms',
            '          [... stack stripped ...]',
            '  ...',
            '# first',
            'ok 2 should be truthy',
            '# second',
            'ok 3 should be truthy',
            '',
            '1..3',
            '# tests 3',
            '# pass  2',
            '# fail  1',
        ].join('\n') + '\n');
    };

    test.createStream().pipe(concat(tc));

    test('nested without plan or end', function(t) {
        t.test('first', function(q) {
            setTimeout(function first() {
                q.ok(true);
                q.end()
            }, 10);
        });
        t.test('second', function(q) {
            setTimeout(function second() {
                q.ok(true);
                q.end()
            }, 10);
        });

        t.timeoutAfter(100);
    });
});
