var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('skip output test', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# SKIP we require more vespene gas',
            '# skip assertions',
            'ok 1 not enough pylons # SKIP',
            '# skip subtests',
            '# SKIP we require more ziggurats',
            '',
            '1..1',
            '# tests 1',
            '# pass  1',
            '# skip  3',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness({ exit: false });
    tapeTest.createStream().pipe(concat(verify));

    // doesn't look like test.skip is available with createHarness()
    // tapeTest.skip('we require more minerals', function (t) {
    //     t.plan(1);
    //     t.fail('should not fail test.skip()');
    // });

    tapeTest('we require more vespene gas', { skip: true }, function (t) {
        t.plan(1);
        t.fail('should not fail test with { skip: true}');
    });

    tapeTest('skip assertions', function (t) {
        t.plan(1);
        t.skip('not enough pylons');
    });

    tapeTest('skip subtests', function (t) {
        // doesn't look like test.skip is available with createHarness()
        // test.skip('build more farms', function (t) {
        //     t.plan(1)
        //     t.fail('should not run subtest with test.skip()');
        // });
        t.test('we require more ziggurats', { skip: true }, function (tt) {
            tt.plan(1);
            tt.fail('should not run subtest with { skip: true }');
        });
        t.end();
    });
});
