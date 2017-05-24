var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('onTest abort', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test',
            'ok 1 assertion 1',
            '# second test',
            'not ok 2 assertion 2',
            '  ---',
            '    operator: fail',
            '  ...',
            '',
            '1..2',
            '# tests 2',
            '# pass  1',
            '# fail  1',
            '',
            'Bail out! Aborting on first failed test',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onTest(function (t) {
        if (t.failCount > 0) {
            tapeTest.abort("Aborting on first failed test");
        }
    });
    
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        t.fail("assertion 2");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.pass("assertion 3");
        t.end();
    });
});

tap.test('onTest cleanup', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test',
            'ok 1 assertion 1',
            '# second test',
            'ok 2 assertion 2',
            'ok 3 assertion 3',
            '# third test',
            'ok 4 assertion 4',
            '',
            '1..4',
            '# tests 4',
            '# pass  4',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    var externalData = [];
    tapeTest.onTest(function (t) {
        externalData = [];
    });
    
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        externalData.push("x");
        t.equal(externalData.length, 1, "assertion 1");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        externalData.push("x");
        t.equal(externalData.length, 1, "assertion 2");
        externalData.push("y");
        t.equal(externalData.length, 2, "assertion 3");
        t.end();
    });

    tapeTest('third test', function (t) {
        externalData.push("z");
        t.equal(externalData.length, 1, "assertion 4");
        t.end();
    });
});

tap.test('onTest comment', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test',
            'ok 1 assertion 1',
            'ok 2 assertion 2',
            '# (2 passed, 0 failed)',
            '# second test',
            'ok 3 assertion 3',
            'not ok 4 assertion 4',
            '  ---',
            '    operator: fail',
            '  ...',
            '# (1 passed, 1 failed)',
            '# third test',
            'not ok 5 assertion 5',
            '  ---',
            '    operator: fail',
            '  ...',
            'not ok 6 assertion 6',
            '  ---',
            '    operator: fail',
            '  ...',
            '# (0 passed, 2 failed)',
            '',
            '1..6',
            '# tests 6',
            '# pass  3',
            '# fail  3',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onTest(function (t) {
        var passCount = t.assertCount - t.failCount;
        t.comment("(" + passCount + " passed, " + t.failCount + " failed)");
    });
    
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.pass("assertion 2");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        t.pass("assertion 3");
        t.fail("assertion 4");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.fail("assertion 5");
        t.fail("assertion 6");
        t.end();
    });
});
