var tap = require('tap');
var spawn = require('child_process').spawn;
var trim = require('string.prototype.trim');

tap.test('numbering for -n argument', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, [
            'TAP version 13',
            '[1] only -n test 1',
            { id: 1, ok: true, name: 'yes 1' },
            '[2] only -n test 2',
            { id: 2, ok: true, name: 'yes 2' },
            '[3] only -n test 3',
            { id: 3, ok: true, name: 'yes 3' },
            'tests 3',
            'pass  3',
            'ok'
        ]);
    });
    
    var ps = tape('-n only-number/only-n.js')
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running only X in -nX argument', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, expectedResult('[2] only -n2 test 2'));
    });
    
    var ps = tape('-n2 only-number/only-n2.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running only -n2 despite .only on test 1', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, expectedResult('[2] only -n2 test 2 w/o only'));
    });
    
    var ps = tape('-n2 only-number/only1-n2.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running only -n2 also having .only', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, expectedResult('[2] only -n2 test 2 w/ only'));
    });
    
    var ps = tape('-n2 only-number/only2-n2.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running only -n2 despite .only on test 3', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, expectedResult('[2] only -n2 test 2 w/o only'));
    });
    
    var ps = tape('-n2 only-number/only3-n2.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running -nX where X is not in 1st file', function (t) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, expectedResult('[5] multi2 test 2'));
    });
    
    var ps = tape('-n5 only-number/multi1-n5.js only-number/multi2-n5.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 0);
    });
});

tap.test('running -nX where X == 0', function (t) {
    testInvalidNumber(t, 0);
});

tap.test('running -nX where X > number of tests', function (t) {
    testInvalidNumber(t, 5);
});

function tape(args) {
  var proc = require('child_process')
  var bin = __dirname + '/../bin/tape'

  return proc.spawn(bin, args.split(' '), { cwd: __dirname })
}

function expectedResult(testName) {
    return [
        'TAP version 13',
        testName,
        { id: 1, ok: true, name: 'yes 2' },
        'tests 1',
        'pass  1',
        'ok'
    ];
}

function testInvalidNumber(t, n) {
    t.plan(2);
    
    var tc = tap.createConsumer();
    
    var rows = [];
    tc.on('data', function (r) { rows.push(r) });
    tc.on('end', function () {
        var rs = rows.map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });
        t.same(rs, [
            'TAP version 13',
            '*** test '+ n +' not found ***'
        ]);
    });
    
    var ps = tape('-n'+ n +' only-number/multi1-n5.js');
    ps.stdout.pipe(tc);
    ps.on('exit', function (code) {
        t.equal(code, 1);
    });
}
