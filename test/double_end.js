var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test(function (t) {
    t.plan(1);
    
    var test = tape.createHarness();
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (row) { rows.push(row) });
    tc.on('end', function () {
        t.deepEqual(rows, [
            'TAP version 13',
            'double end',
            { id: 1, ok: true, name: 'should be equivalent' },
            { id: 2, ok: false, name: '.end() called twice' },
            'tests 2',
            'pass  1',
            'fail  1',
        ]);
    });
    
    test.createStream().pipe(tc);
    
    test('double end', function (tt) {
        tt.equal(1 + 1, 2);
        tt.end();
        setTimeout(function () {
            tt.end();
        }, 5);
    });
});
