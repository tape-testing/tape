var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var yaml = require('js-yaml');

tap.test('deep equal failure', function (assert) {
    var test = tape.createHarness({ exit : false });
    var stream = test.createStream();
    var parser = tapParser();
    assert.plan(7);

    stream.pipe(parser);
    stream.pipe(concat(function (body) {
        var expectedLines = [
            'TAP version 13',
            '# deep equal',
            'not ok 1 should be equal',
            '  ---',
            '    operator: equal',
            '    expected: |-',
            '      { b: 2 }',
            '    actual: |-',
            '      { a: 1 }'
        ];
        var found = body.toString('utf8').split('\n');
        assert.equal(found.slice(0, expectedLines.length).join('\n'), expectedLines.join('\n'));
        // The next line will vary depending on where the test is executed. Match it with a regex
        assert.ok(/    at:.*deep-equal-failure.js:\d+:\d+/.test(found[expectedLines.length]));
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

        found = getDiag(body);
        assert.ok(/.*deep-equal-failure.js:\d+:\d+/.test(found.at));
        delete found.at;
        assert.deepEqual(found, {
          operator: 'equal',
          expected: '{ b: 2 }',
          actual: '{ a: 1 }'
        });
    }));

    parser.once('assert', function (data) {
        assert.ok(/.*deep-equal-failure.js:\d+:\d+/.test(data.diag.at));
        delete data.diag.at;
        assert.deepEqual(data, {
            ok: false,
            id: 1,
            name: 'should be equal',
            diag: {
              operator: 'equal',
              expected: '{ b: 2 }',
              actual: '{ a: 1 }'
            }
        });
    });

    test("deep equal", function (t) {
        t.plan(1);
        t.equal({a: 1}, {b: 2});
    });
})

function getDiag (body) {
    var yamlStart = body.indexOf('  ---');
    var yamlEnd = body.indexOf('  ...\n');
    var diag = body.slice(yamlStart, yamlEnd).split('\n').map(function (line) {
        return line.slice(2);
   }).join('\n');

   return yaml.safeLoad(diag);
}
