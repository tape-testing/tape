var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('test onStart renaming', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# [1] first test',
            'ok 1 assertion 1',
            '# SKIP [2] second test',
            '# [3] third test',
            'ok 2 assertion 3',
            '',
            '1..2',
            '# tests 2',
            '# pass  2',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onStart(function (tests) {
        for (var i=0; i < tests.length; ++i) {
            tests[i].name = '[' + (i+1) + '] ' + tests[i].name;
        }
    });

    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.end();
    });
    
    tapeTest('second test', { skip: true }, function (t) {
        t.fail("assertion 2");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.pass("assertion 3");
        t.end();
    });
});

tap.test('test onStart filtering', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test',
            'ok 1 assertion 1',
            '# third test',
            'ok 2 assertion 3',
            '',
            '1..2',
            '# tests 2',
            '# pass  2',
            '',
            '# ok',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onStart(function (tests) {
        var i = tests.length;
        while (--i >= 0) {
            if (/[+]deprecated/.test(tests[i].name)) {
                tests.splice(i, 1);
            }
        }
    });
    
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.end();
    });
    
    tapeTest('second test +deprecated', function (t) {
        t.fail("assertion 2");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.pass("assertion 3");
        t.end();
    });

    tapeTest('fourth test +deprecated', function (t) {
        t.fail("assertion 4");
        t.end();
    });
});
