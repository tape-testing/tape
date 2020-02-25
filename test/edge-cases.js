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
            + 'not ok 3 0 notEqual to -0\n'
            + '  ---\n'
            + '    operator: notEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 notEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 4 -0 notEqual to 0\n'
            + '  ---\n'
            + '    operator: notEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 notEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 5 0 looseEqual to -0\n'
            + 'ok 6 -0 looseEqual to 0\n'
            + 'not ok 7 0 notLooseEqual to -0\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 notLooseEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 8 -0 notLooseEqual to 0\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 notLooseEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 9 0 strictEqual to -0\n'
            + 'ok 10 -0 strictEqual to 0\n'
            + 'not ok 11 0 notStrictEqual to -0\n'
            + '  ---\n'
            + '    operator: notEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 notStrictEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 12 -0 notStrictEqual to 0\n'
            + '  ---\n'
            + '    operator: notEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 notStrictEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 13 0 deepLooseEqual to -0\n'
            + 'ok 14 -0 deepLooseEqual to 0\n'
            + 'not ok 15 0 notDeepLooseEqual to -0\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: |-\n'
            + '      -0\n'
            + '    actual: |-\n'
            + '      0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: 0 notDeepLooseEqual to -0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 16 -0 notDeepLooseEqual to 0\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: |-\n'
            + '      0\n'
            + '    actual: |-\n'
            + '      -0\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: -0 notDeepLooseEqual to 0\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 17 0 deepEqual to -0\n'
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
            + 'not ok 18 -0 deepEqual to 0\n'
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
            + 'ok 19 0 notDeepEqual to -0\n'
            + 'ok 20 -0 notDeepEqual to 0\n'
            + '# NaNs\n'
            + 'not ok 21 NaN equal to NaN\n'
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
            + 'ok 22 NaN notEqual to NaN\n'
            + 'not ok 23 NaN looseEqual to NaN\n'
            + '  ---\n'
            + '    operator: deepLooseEqual\n'
            + '    expected: NaN\n'
            + '    actual:   NaN\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: NaN looseEqual to NaN\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 24 NaN notLooseEqual to NaN\n'
            + 'not ok 25 NaN strictEqual to NaN\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: NaN\n'
            + '    actual:   NaN\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: NaN strictEqual to NaN\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 26 NaN notStrictEqual to NaN\n'
            + 'not ok 27 NaN deepLooseEqual to NaN\n'
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
            + 'ok 28 NaN notDeepLooseEqual to NaN\n'
            + 'ok 29 NaN deepEqual to NaN\n'
            + 'not ok 30 NaN notDeepEqual to NaN\n'
            + '  ---\n'
            + '    operator: notDeepEqual\n'
            + '    expected: NaN\n'
            + '    actual:   NaN\n'
            + '    at: Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: NaN notDeepEqual to NaN\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/edge-cases.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + '\n1..30\n'
            + '# tests 30\n'
            + '# pass  15\n'
            + '# fail  15\n'
        );
    }));

    test('zeroes', function (t) {
        t.equal(0, -0, '0 equal to -0');
        t.equal(-0, 0, '-0 equal to 0');
        t.notEqual(0, -0, '0 notEqual to -0');
        t.notEqual(-0, 0, '-0 notEqual to 0');

        t.looseEqual(0, -0, '0 looseEqual to -0');
        t.looseEqual(-0, 0, '-0 looseEqual to 0');
        t.notLooseEqual(0, -0, '0 notLooseEqual to -0');
        t.notLooseEqual(-0, 0, '-0 notLooseEqual to 0');

        t.strictEqual(0, -0, '0 strictEqual to -0');
        t.strictEqual(-0, 0, '-0 strictEqual to 0');
        t.notStrictEqual(0, -0, '0 notStrictEqual to -0');
        t.notStrictEqual(-0, 0, '-0 notStrictEqual to 0');

        t.deepLooseEqual(0, -0, '0 deepLooseEqual to -0');
        t.deepLooseEqual(-0, 0, '-0 deepLooseEqual to 0');
        t.notDeepLooseEqual(0, -0, '0 notDeepLooseEqual to -0');
        t.notDeepLooseEqual(-0, 0, '-0 notDeepLooseEqual to 0');

        t.deepEqual(0, -0, '0 deepEqual to -0');
        t.deepEqual(-0, 0, '-0 deepEqual to 0');
        t.notDeepEqual(0, -0, '0 notDeepEqual to -0');
        t.notDeepEqual(-0, 0, '-0 notDeepEqual to 0');

        t.end();
    });

    test('NaNs', function (t) {
        t.equal(NaN, NaN, 'NaN equal to NaN');
        t.notEqual(NaN, NaN, 'NaN notEqual to NaN');

        t.looseEqual(NaN, NaN, 'NaN looseEqual to NaN');
        t.notLooseEqual(NaN, NaN, 'NaN notLooseEqual to NaN');

        t.strictEqual(NaN, NaN, 'NaN strictEqual to NaN');
        t.notStrictEqual(NaN, NaN, 'NaN notStrictEqual to NaN');

        t.deepLooseEqual(NaN, NaN, 'NaN deepLooseEqual to NaN');
        t.notDeepLooseEqual(NaN, NaN, 'NaN notDeepLooseEqual to NaN');

        t.deepEqual(NaN, NaN, 'NaN deepEqual to NaN');
        t.notDeepEqual(NaN, NaN, 'NaN notDeepEqual to NaN');

        t.end();
    });
});
