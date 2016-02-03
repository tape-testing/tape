var tap = require('tap');
var tape = require('../');
var tapParser = require('tap-parser');

tap.test('tape only test', function (tt) {
    var test = tape.createHarness();
    var stream = test.createStream();
    var parser = stream.pipe(tapParser());

    var ran = [];

    parser.once('assert', function (data) {
        tt.deepEqual(data, {
            id: 1,
            name: "assert name",
            ok: true
        });
        tt.deepEqual(ran, [3]);
        tt.end();
    });

    test("never run fail", function (t) {
        ran.push(1);
        t.equal(true, false);
        t.end();
    });

    test("never run success", function (t) {
        ran.push(2);
        t.equal(true, true);
        t.end();
    });

    test.only("run success", function (t) {
        ran.push(3);
        t.ok(true, "assert name");
        t.end();
    });
});
