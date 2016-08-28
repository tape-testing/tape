var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test('timeoutAfter test', function (tt) {
    tt.plan(1);
    
    var test = tape.createHarness();
    var tc = function (rows) {

        var rs = rows.toString('utf8').split('\n');
        tt.same(rs, [
            'TAP version 13',
            '# timeoutAfter',
            'not ok 1 test timed out after 1ms',
            '  ---',
            '    operator: fail',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1',
            ''
        ]);
    };
    
    test.createStream().pipe(concat(tc));
    
    test('timeoutAfter', function (t) {
        t.plan(1);
        t.timeoutAfter(1);
    });
});
