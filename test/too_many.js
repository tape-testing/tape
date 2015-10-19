var tape = require('../');
var tap = require('tap');
var tapParser = require('tap-parser');

tap.test('too many test', function (tt) {
    tt.plan(4);
    
    var test = tape.createHarness({ exit : false });
    var stream = test.createStream();
    var parser = stream.pipe(tapParser());

    var asserts = [
        'true',
        'empty object',
        'empty array',
        'not empty string'
    ];
    var i = 0;
    var plan = 3;

    parser.on('assert', function (data) {
        var assert = i !== plan + 1
            ? {
                id: i + 1,
                name: asserts[i++] + " is truthy",
                ok: true
            } : {
                id: i++,
                name: "plan != count",
                ok: false
            };
        tt.deepEqual(data, assert);
    });

    test('array', function (t) {
        t.plan(plan);

        t.assert(true, 'true is truthy');
        t.assert({}, 'empty object is truthy');
        t.assert([], 'empty array is truthy');
        t.assert('not empty', 'not empty string is truthy');
    });
});
