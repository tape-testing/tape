var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test('skip output test', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit : false });
    test.createStream().pipe(concat(function (body) {
        tt.equal(
            body.toString('utf8'),
            'TAP version 13\n'
            + '# skip assertions\n'
            + 'ok 1 # SKIP not enough pylons\n'
            + '# skip subtests\n'
            + '\n'
            + '1..1\n'
            + '# tests 1\n'
            + '# skip 1\n'
            + '# pass  0\n'
            + '\n'
            + '# ok\n'
        );
    }));

    // doesn't look like test.skip is available with createHarness()
    // test.skip('we require more minerals', function (t) {
    //     t.plan(1);
    //     t.fail('should not fail test.skip()');
    // });

    test('we require more vespene gas', { skip: true }, function (t) {
        t.plan(1);
        t.fail('should not fail test with { skip: true}');
    });

    test('skip assertions', function (t) {
        t.plan(1);
        t.skip('not enough pylons');
    });

    test('skip subtests', function (t) {
        // doesn't look like test.skip is available with createHarness()
        // test.skip('build more farms', function (t) {
        //     t.plan(1)
        //     t.fail('should not run subtest with test.skip()');
        // });
        test('we require more ziggurats', { skip: true }, function (t) {
            t.plan(1)
            t.fail('should not run subtest with { skip: true }');
        });
        t.end();
    });
});
