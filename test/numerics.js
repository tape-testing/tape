'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('numerics', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    test.createStream().pipe(concat(function (body) {
        tt.equal(
            stripFullStack(body.toString('utf8')),
            'TAP version 13\n'
            + '# numeric strings\n'
            + 'not ok 1 number equal to string\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number equal to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 2 string equal to number\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string equal to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 3 number notEqual to string\n'
            + 'ok 4 string notEqual to number\n'
            + 'ok 5 number looseEqual to string\n'
            + 'ok 6 string looseEqual to number\n'
            + 'not ok 7 number notLooseEqual to string\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number notLooseEqual to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 8 string notLooseEqual to number\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string notLooseEqual to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 9 number strictEqual to string\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number strictEqual to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 10 string strictEqual to number\n'
            + '  ---\n'
            + '    operator: equal\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string strictEqual to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 11 number notStrictEqual to string\n'
            + 'ok 12 string notStrictEqual to number\n'
            + 'ok 13 number deepLooseEqual to string\n'
            + 'ok 14 string deepLooseEqual to number\n'
            + 'not ok 15 number notDeepLooseEqual to string\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number notDeepLooseEqual to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 16 string notDeepLooseEqual to number\n'
            + '  ---\n'
            + '    operator: notDeepLooseEqual\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string notDeepLooseEqual to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 17 number deepEqual to string\n'
            + '  ---\n'
            + '    operator: deepEqual\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number deepEqual to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 18 string deepEqual to number\n'
            + '  ---\n'
            + '    operator: deepEqual\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string deepEqual to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 19 number notDeepEqual to string\n'
            + 'ok 20 string notDeepEqual to number\n'
            + '\n1..20\n'
            + '# tests 20\n'
            + '# pass  10\n'
            + '# fail  10\n'
        );
    }));

    test('numeric strings', function (t) {
        t.equal(3, '3', 'number equal to string');
        t.equal('3', 3, 'string equal to number');
        t.notEqual(3, '3', 'number notEqual to string');
        t.notEqual('3', 3, 'string notEqual to number');

        t.looseEqual(3, '3', 'number looseEqual to string');
        t.looseEqual('3', 3, 'string looseEqual to number');
        t.notLooseEqual(3, '3', 'number notLooseEqual to string');
        t.notLooseEqual('3', 3, 'string notLooseEqual to number');

        t.strictEqual(3, '3', 'number strictEqual to string');
        t.strictEqual('3', 3, 'string strictEqual to number');
        t.notStrictEqual(3, '3', 'number notStrictEqual to string');
        t.notStrictEqual('3', 3, 'string notStrictEqual to number');

        t.deepLooseEqual(3, '3', 'number deepLooseEqual to string');
        t.deepLooseEqual('3', 3, 'string deepLooseEqual to number');
        t.notDeepLooseEqual(3, '3', 'number notDeepLooseEqual to string');
        t.notDeepLooseEqual('3', 3, 'string notDeepLooseEqual to number');

        t.deepEqual(3, '3', 'number deepEqual to string');
        t.deepEqual('3', 3, 'string deepEqual to number');
        t.notDeepEqual(3, '3', 'number notDeepEqual to string');
        t.notDeepEqual('3', 3, 'string notDeepEqual to number');

        t.end();
    });
});
