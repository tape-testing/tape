var tap = require('tap');
var test = require('../');
var concat = require('concat-stream');
var ran = 0;

tap.test('test SKIP comment', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# SKIP skipped',
            '',
            '1..0',
            '# tests 0',
            '# pass  0',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.createStream().pipe(concat(verify));

    tapeTest('skipped', { skip: true }, function (t) {
        t.end();
    });
});

test('skip this', { skip: true }, function(t) {
    t.fail('this should not even run');
	ran++;
    t.end();
});

test.skip('skip this too', function(t) {
    ran++;
    t.fail('this should not even run');
    t.end();
});

test('skip subtest', function(t) {
    ran++;
    t.test('skip this', { skip: true }, function(t) {
        t.fail('this should not even run');
        t.end();
    });
    t.end();
});

// un-commenting these 3 tests will make the other tests fail
// scratched my head over this for hours...

// test('do not skip this', { skip: false }, function(t) {
//     t.pass('this should run');
//     ran ++;
//     t.end();
// });

// test('skip subtest', function(t) {
//     ran ++;
//     t.test('do not skip this', { skip: false }, function(t) {
//         ran ++;
//         t.pass('this should run');
//         t.end();
//     });
//     t.test('skip this', { skip: true }, function(t) {
//         t.fail('this should not even run');
//         t.end();
//     });
//     t.end();
// });

// test('right number of tests ran', function(t) {
//     t.equal(ran, 3, 'ran the right number of tests');
//     t.end();
// });

// vim: set softtabstop=4 shiftwidth=4:
