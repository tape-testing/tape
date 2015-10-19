var tape = require('../');
var tap = require('tap');
var tapParser = require('tap-parser');

tap.test('timeoutAfter test', function (tt) {
    tt.plan(1);
    
    var test = tape.createHarness();
    var stream = test.createStream();
    var parser = stream.pipe(tapParser());

    parser.once('assert', function (data) {
        tt.deepEqual(data, {
            diag: {
                operator: "fail"
            },
            id: 1,
            name: "test timed out after 1ms",
            ok: false
        });
    });


    test('timeoutAfter', function (t) {
        t.plan(1);
        t.timeoutAfter(1);
    });
});
