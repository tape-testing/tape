var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var yaml = require('js-yaml');

tap.test('preserves stack trace with newlines', function (tt) {
    tt.plan(7);

    var test = tape.createHarness();
    var stream = test.createStream();
    var parser = stream.pipe(tapParser());
    var stackTrace = 'foo\n  bar';

    parser.once('assert', function (data) {
        tt.ok(/.*stackTrace.js:\d+:\d+/.test(data.diag.at));
        delete data.diag.at;
        tt.deepEqual(data, {
            ok: false,
            id: 1,
            name: "Error: Preserve stack",
            diag: {
                stack: stackTrace,
                operator: 'error',
                expected: 'undefined',
                actual: '[Error: Preserve stack]'
            }
        });
    });

    stream.pipe(concat(function (body) {
        var body = body.toString('utf8')

        var expectedLines = [
            'TAP version 13',
            '# multiline stack trace',
            'not ok 1 Error: Preserve stack',
            '  ---',
            '    operator: error',
            '    expected: |-',
            '      undefined',
            '    actual: |-',
            '      [Error: Preserve stack]',
        ];
        var found = body.split('\n');
        tt.equal(found.slice(0, expectedLines.length).join('\n'), expectedLines.join('\n'));
        // The next line will vary depending on where the test is executed. Match it with a regex
        tt.ok(/    at:.*stackTrace.js:\d+:\d+/.test(found[expectedLines.length]));
        // Now test the rest
        found = found.slice(expectedLines.length + 1);
        expectedLines = [
            '    stack: |-',
            '      foo',
            '        bar',
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1\n',
        ];
        tt.equal(found.join('\n'), expectedLines.join('\n'));

        found = getDiag(body);
        tt.ok(/.*stackTrace.js:\d+:\d+/.test(found.at));
        delete found.at;
        tt.deepEqual(found, {
            stack: stackTrace,
            operator: 'error',
            expected: 'undefined',
            actual: '[Error: Preserve stack]'
        });
    }));

    test('multiline stack trace', function (t) {
        t.plan(1);
        var err = new Error('Preserve stack');
        err.stack = stackTrace;
        t.error(err);
    });
});

function getDiag (body) {
    var yamlStart = body.indexOf('  ---');
    var yamlEnd = body.indexOf('  ...\n');
    var diag = body.slice(yamlStart, yamlEnd).split('\n').map(function (line) {
        return line.slice(2);
   }).join('\n');

   return yaml.safeLoad(diag);
}
