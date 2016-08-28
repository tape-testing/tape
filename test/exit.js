var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

tap.test('exit ok', function (t) {
    t.plan(2);
    
    var tc = function (rows) {
        t.same(rows.toString('utf8'), [
            'TAP version 13',
            '# array',
            '# hi',
            'ok 1 should be equivalent',
            'ok 2 should be equivalent',
            'ok 3 should be equivalent',
            'ok 4 should be equivalent',
            'ok 5 should be equivalent',
            '',
            '1..5',
            '# tests 5',
            '# pass  5',
            '',
            '# ok',
            '',
            ''
        ].join('\n'));
    }
    
    var ps = spawn(process.execPath, [ __dirname + '/exit/ok.js' ]);
    ps.stdout.pipe(concat(tc));
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('exit fail', function (t) {
    t.plan(2);
    
    var tc = function (rows) {
        t.same(rows.toString('utf8'), [
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
            '  ...',
            '',
            '1..5',
            '# tests 5',
            '# pass  4',
            '# fail  1',
            '',
            ''
        ].join('\n'));
    };
    
    var ps = spawn(process.execPath, [ __dirname + '/exit/fail.js' ]);
    ps.stdout.pipe(concat(tc));
    ps.on('exit', function (code) {
        t.notEqual(code, 0);
    });
});

tap.test('too few exit', function (t) {
    t.plan(2);
    
    var tc = function (rows) { 
        t.same(rows.toString('utf8'), [
            'TAP version 13',
            '# array',
            'ok 1 should be equivalent',
            'ok 2 should be equivalent',
            'ok 3 should be equivalent',
            'ok 4 should be equivalent',
            'ok 5 should be equivalent',
            'not ok 6 plan != count',
            '  ---',
            '    operator: fail',
            '    expected: 6',
            '    actual:   5',
            '  ...',
            '',
            '1..6',
            '# tests 6',
            '# pass  5',
            '# fail  1',
            '',
            ''
        ].join('\n'));
    };
    
    var ps = spawn(process.execPath, [ __dirname + '/exit/too_few.js' ]);
    ps.stdout.pipe(concat(tc));
    ps.on('exit', function (code) {
        t.notEqual(code, 0);
    });
});

tap.test('more planned in a second test', function (t) {
    t.plan(2);
    
    var tc = function (rows) {
        t.same(rows.toString('utf8'), [
            'TAP version 13',
            '# first',
            'ok 1 should be truthy',
            '# second',
            'ok 2 should be truthy',
            'not ok 3 plan != count',
            '  ---',
            '    operator: fail',
            '    expected: 2',
            '    actual:   1',
            '  ...',
            '',
            '1..3',
            '# tests 3',
            '# pass  2',
            '# fail  1',
            '',
            '',
        ].join('\n'));
    };
    
    var ps = spawn(process.execPath, [ __dirname + '/exit/second.js' ]);
    ps.stdout.pipe(concat(tc));
    ps.on('exit', function (code) {
        t.notEqual(code, 0);
    });
});
