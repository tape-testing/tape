var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test('array test', function (tt) {
    tt.plan(3);
    
    var test = tape.createHarness();
    test.createStream().pipe(concat(function (body) {
        var expectedLines = [
            'TAP version 13',
            '# undef',
            'not ok 1 should be equivalent',
            '  ---',
            '    operator: deepEqual',
            '    expected: |-',
            '      { beep: undefined }',
            '    actual: |-',
            '      {}',
        ];
        var found = body.toString('utf8').split('\n');
        tt.equal(found.slice(0, expectedLines.length).join('\n'), expectedLines.join('\n'));
        // The next line will vary depending on where the test is executed. Match it with a regex
        tt.ok(/    at:.*undef.js:\d+:\d+/.test(found[expectedLines.length]));
        // Now test the rest
        found = found.slice(expectedLines.length + 1);
        expectedLines = [
            '  ...',
            '',
            '1..1',
            '# tests 1',
            '# pass  0',
            '# fail  1\n',
        ];
        tt.equal(found.join('\n'), expectedLines.join('\n'));
    }));
    
    test('undef', function (t) {
        t.plan(1);
        t.deepEqual({}, { beep: undefined });
    });
});
