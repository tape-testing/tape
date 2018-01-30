var falafel = require('falafel');
var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('array test', function (tt) {
    tt.plan(1);
    
    var test = tape.createHarness({ exit : false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# array',
            'ok 1 should be equivalent',
            'ok 2 should be equivalent',
            'ok 3 should be equivalent',
            'ok 4 should be equivalent',
            'not ok 5 should be equivalent',
            '  ---',
            '    operator: deepEqual',
            '    expected: [ [ 1, 2, [ 3, 4444 ] ], [ 5, 6 ] ]',
            '    actual:   [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ]',
            '    at: <anonymous> ($TEST/fail.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: should be equivalent',
            '          [... stack stripped ...]',
            '          at $TEST/fail.js:$LINE:$COL',
            '          at eval (eval at <anonymous> ($TEST/fail.js:$LINE:$COL))',
            '          at eval (eval at <anonymous> ($TEST/fail.js:$LINE:$COL))',
            '          at Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..5',
            '# tests 5',
            '# pass  4',
            '# fail  1',
            ''
        ].join('\n'));
    };
    
    test.createStream().pipe(concat(tc));
    
    test('array', function (t) {
        t.plan(5);
        
        var src = '(' + function () {
            var xs = [ 1, 2, [ 3, 4 ] ];
            var ys = [ 5, 6 ];
            g([ xs, ys ]);
        } + ')()';
        
        var output = falafel(src, function (node) {
            if (node.type === 'ArrayExpression') {
                node.update('fn(' + node.source() + ')');
            }
        });
        
        var arrays = [
            [ 3, 4 ],
            [ 1, 2, [ 3, 4 ] ],
            [ 5, 6 ],
            [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ],
        ];
        
        Function(['fn','g'], output)(
            function (xs) {
                t.same(arrays.shift(), xs);
                return xs;
            },
            function (xs) {
                t.same(xs, [ [ 1, 2, [ 3, 4444 ] ], [ 5, 6 ] ]);
            }
        );
    });
});

tap.test('t.lessThan test', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit : false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# t.lessThan',
            'not ok 1 should be less than',
            '  ---',
            '    operator: lessThan',
            '    expected: \'< 1\'',
            '    actual:   2',
            '    at: Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: should be less than',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1',
            ''
        ].join('\n'));
    };

    test.createStream().pipe(concat(tc));

    test('t.lessThan', function (t) {
        t.plan(1);
        t.lessThan(2, 1);
    });
});

tap.test('t.greaterThan test', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit : false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# t.greaterThan',
            'not ok 1 should be greater than',
            '  ---',
            '    operator: greaterThan',
            '    expected: \'> 2\'',
            '    actual:   1',
            '    at: Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: should be greater than',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1',
            ''
        ].join('\n'));
    };

    test.createStream().pipe(concat(tc));

    test('t.greaterThan', function (t) {
        t.plan(1);
        t.greaterThan(1, 2);
    });
});

tap.test('t.lessThanOrEqual test', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit : false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# t.lessThanOrEqual',
            'not ok 1 should be less than or equal',
            '  ---',
            '    operator: lessThanOrEqual',
            '    expected: \'<= 1\'',
            '    actual:   2',
            '    at: Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: should be less than or equal',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1',
            ''
        ].join('\n'));
    };

    test.createStream().pipe(concat(tc));

    test('t.lessThanOrEqual', function (t) {
        t.plan(1);
        t.lessThanOrEqual(2, 1);
    });
});

tap.test('t.greaterThanOrEqual test', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit : false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# t.greaterThanOrEqual',
            'not ok 1 should be greater than or equal',
            '  ---',
            '    operator: greaterThanOrEqual',
            '    expected: \'>= 2\'',
            '    actual:   1',
            '    at: Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: should be greater than or equal',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/fail.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1',
            ''
        ].join('\n'));
    };

    test.createStream().pipe(concat(tc));

    test('t.greaterThanOrEqual', function (t) {
        t.plan(1);
        t.greaterThanOrEqual(1, 2);
    });
});
