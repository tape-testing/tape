var test = require('tap').test;
var concat = require('concat-stream');
var spawn = require('child_process').spawn;

test(function (t) {
    t.plan(4);
    var ps = spawn(process.execPath, [ __dirname + '/double_end/double.js' ]);
    ps.on('exit', function (code) {
        t.equal(code, 1);
    });
    ps.stdout.pipe(concat(function (body) {
        var expectedLines = [
            'TAP version 13',
            '# double end',
            'ok 1 should be equal',
            'not ok 2 .end() called twice',
            '  ---',
            '    operator: fail',
        ];
        var found = body.toString('utf8').split('\n');
        t.equal(found.slice(0, expectedLines.length).join('\n'), expectedLines.join('\n'));
        // The next line will vary depending on where the test is executed. Match it with a regex
        t.ok(/    at:.*double.js:\d+:\d+/.test(found[expectedLines.length]));
        // Now test the rest
        found = found.slice(expectedLines.length + 1);
        expectedLines = [
            '  ...',
            '',
            '1..2',
            '# tests 2',
            '# pass  1',
            '# fail  1\n\n',
        ];
        t.equal(found.join('\n'), expectedLines.join('\n'));
    }));
});
