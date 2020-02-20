'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('edge cases', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    test.createStream().pipe(concat(function (body) {
        tt.equal(
            stripFullStack(body.toString('utf8')),
            'TAP version 13\n'
            + '# zeroes\n'
            + 'ok 1 0 equal to -0\n'
            + 'ok 2 -0 equal to 0\n'
            + 'not ok 3 0 strictEqual to -0\n'
            + '  ---\n'
            + '    operator: strictEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 strictEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 4 -0 strictEqual to 0\n'
            + '  ---\n'
            + '    operator: strictEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 strictEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 5 0 deepLooseEqual to -0\n'
            + 'ok 6 -0 deepLooseEqual to 0\n'
            + 'not ok 7 0 deepEqual to -0\n'
            + '  ---\n'
            + '    operator: deepEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 deepEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 8 -0 deepEqual to 0\n'
            + '  ---\n'
            + '    operator: deepEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 deepEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + '# NaNs\n'
            + 'not ok 9 NaN equal to NaN\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: NaN\n'
            + '    actual:   NaN\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: NaN equal to NaN\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 10 NaN strictEqual to NaN\n'
            + 'not ok 11 NaN deepLooseEqual to NaN\n'
            + '  ---\n'
            + '    operator: deepLooseEqual\n'
            + '    expected: NaN\n'
            + '    actual:   NaN\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: NaN deepLooseEqual to NaN\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 12 NaN deepEqual to NaN\n'
            + '\n1..12\n'
            + '# tests 12\n'
            + '# pass  6\n'
            + '# fail  6\n'
        );
    }));

    test('zeroes', function (t) {
        t.equal(0, -0, '0 equal to -0');
        t.equal(-0, 0, '-0 equal to 0');

        t.strictEqual(0, -0, '0 strictEqual to -0');
        t.strictEqual(-0, 0, '-0 strictEqual to 0');

        t.deepLooseEqual(0, -0, '0 deepLooseEqual to -0');
        t.deepLooseEqual(-0, 0, '-0 deepLooseEqual to 0');

        t.deepEqual(0, -0, '0 deepEqual to -0');
        t.deepEqual(-0, 0, '-0 deepEqual to 0');

        t.end();
    });

    test('NaNs', function (t) {
        t.equal(NaN, NaN, 'NaN equal to NaN');

        t.strictEqual(NaN, NaN, 'NaN strictEqual to NaN');

        t.deepLooseEqual(NaN, NaN, 'NaN deepLooseEqual to NaN');

        t.deepEqual(NaN, NaN, 'NaN deepEqual to NaN');

        t.end();
    });
});
