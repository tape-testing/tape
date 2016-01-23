var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test('circular test', function (assert) {
    var test = tape.createHarness({ exit : false });
    assert.plan(3);

    test.createStream().pipe(concat(function (body) {
        var expectedLines = [
            'TAP version 13',
            '# circular',
            'not ok 1 should be equal',
            '  ---',
            '    operator: equal',
            '    expected: |-',
            '      {}',
            '    actual: |-',
            '      { circular: [Circular] }'
        ];
        var found = body.toString('utf8').split('\n');
        assert.equal(found.slice(0, expectedLines.length).join('\n'), expectedLines.join('\n'));
        // The next line will vary depending on where the test is executed. Match it with a regex
        assert.ok(/    at:.*circular-things.js:\d+:\d+/.test(found[expectedLines.length]));
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
        assert.equal(found.join('\n'), expectedLines.join('\n'));
    }));

    test("circular", function (t) {
        t.plan(1);
        var circular = {};
        circular.circular = circular;
        t.equal(circular, {});
    })
})
