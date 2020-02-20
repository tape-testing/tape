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
            + 'ok 1 number equal to string\n'
            + 'ok 2 string equal to number\n'
            + 'not ok 3 number strictEqual to string\n'
            + '  ---\n'
            + '    operator: strictEqual\n'
            + '    expected: \'3\'\n'
            + '    actual:   3\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: number strictEqual to string\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'not ok 4 string strictEqual to number\n'
            + '  ---\n'
            + '    operator: strictEqual\n'
            + '    expected: 3\n'
            + '    actual:   \'3\'\n'
            + '    at: Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '    stack: |-\n'
            + '      Error: string strictEqual to number\n'
            + '          [... stack stripped ...]\n'
            + '          at Test.<anonymous> ($TEST/numerics.js:$LINE:$COL)\n'
            + '          [... stack stripped ...]\n'
            + '  ...\n'
            + 'ok 5 number deepLooseEqual to string\n'
            + 'ok 6 string deepLooseEqual to number\n'
            + 'not ok 7 number deepEqual to string\n'
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
            + 'not ok 8 string deepEqual to number\n'
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
            + '\n1..8\n'
            + '# tests 8\n'
            + '# pass  4\n'
            + '# fail  4\n'
        );
    }));

    test('numeric strings', function (t) {
        t.equal(3, '3', 'number equal to string');
        t.equal('3', 3, 'string equal to number');

        t.strictEqual(3, '3', 'number strictEqual to string');
        t.strictEqual('3', 3, 'string strictEqual to number');

        t.deepLooseEqual(3, '3', 'number deepLooseEqual to string');
        t.deepLooseEqual('3', 3, 'string deepLooseEqual to number');

        t.deepEqual(3, '3', 'number deepEqual to string');
        t.deepEqual('3', 3, 'string deepEqual to number');

        t.end();
    });
});
