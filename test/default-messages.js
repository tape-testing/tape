var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

tap.test('default messages', function (t) {
    t.plan(1);

    var ps = spawn(process.execPath, [path.join(__dirname, 'messages', 'defaults.js')]);
    
    ps.stdout.pipe(concat(function (rows) {

        t.same(rows.toString('utf8'), [
            'TAP version 13',
            '# default messages',
            'ok 1 should be truthy',
            'ok 2 should be falsy',
            'ok 3 should be equal',
            'ok 4 should not be equal',
            'ok 5 should be equivalent',
            'ok 6 should be equivalent',
            'ok 7 should be equivalent',
            'ok 8 should be less than',
            'ok 9 should be greater than',
            'ok 10 should be less than or equal',
            'ok 11 should be greater than or equal',
            '',
            '1..11',
            '# tests 11',
            '# pass  11',
            '',
            '# ok'
        ].join('\n') + '\n\n');
    }));
});
