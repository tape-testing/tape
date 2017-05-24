var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('test abort onStart', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '',
            '1..0',
            '# tests 0',
            '# pass  0',
            '',
            'Bail out! Invalid test environment',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.onStart(function (tests) {
        tapeTest.abort('Invalid test environment');
    });

    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        t.pass("assertion 2");
        t.end();
    });
});

tap.test('test abort from test', function (assert) {
    assert.plan(1);

    var verify = function (output) {
        assert.equal(output.toString('utf8'), [
            'TAP version 13',
            '# first test',
            'ok 1 assertion 1',
            '# second test',
            'ok 2 assertion 2',
            '',
            '1..2',
            '# tests 2',
            '# pass  2',
            '',
           'Bail out! Aborted by test suite',
            ''
        ].join('\n'));
    };

    var tapeTest = test.createHarness();
    tapeTest.createStream().pipe(concat(verify));
    
    tapeTest('first test', function (t) {
        t.pass("assertion 1");
        t.end();
    });
    
    tapeTest('second test', function (t) {
        tapeTest.abort(); // use default message
        t.pass("assertion 2");
        t.end();
    });

    tapeTest('third test', function (t) {
        t.pass("assertion 3");
        t.end();
    });
});

// the test of aborting from onTest() is in onTest.js
