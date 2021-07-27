'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('match', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit: false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# match',
            'ok 1 regex arg must be a regex',
            'ok 2 string arg must be a string',
            'not ok 3 The input did not match the regular expression /abc/. Input: \'string\'',
            '  ---',
            '    operator: match',
            '    expected: /abc/',
            '    actual:   \'string\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: The input did not match the regular expression /abc/. Input: \'string\'',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            'not ok 4 "string" does not match /abc/',
            '  ---',
            '    operator: match',
            '    expected: /abc/',
            '    actual:   \'string\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: "string" does not match /abc/',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            'ok 5 The input matched the regular expression /pass$/. Input: \'I will pass\'',
            'ok 6 "I will pass" matches /pass$/',
            '',
            '1..6',
            '# tests 6',
            '# pass  4',
            '# fail  2',
            ''
        ]);
    };

    test.createStream().pipe(concat(tc));

    test('match', function (t) {
        t.plan(6);

        t['throws'](
            function () { t.match(/abc/, 'string'); },
            TypeError,
            'regex arg must be a regex'
        );

        t['throws'](
            function () { t.match({ abc: 123 }, /abc/); },
            TypeError,
            'string arg must be a string'
        );

        t.match('string', /abc/);
        t.match('string', /abc/, '"string" does not match /abc/');

        t.match('I will pass', /pass$/);
        t.match('I will pass', /pass$/, '"I will pass" matches /pass$/');

        t.end();
    });
});

tap.test('doesNotMatch', function (tt) {
    tt.plan(1);

    var test = tape.createHarness({ exit: false });
    var tc = function (rows) {
        tt.same(stripFullStack(rows.toString('utf8')), [
            'TAP version 13',
            '# doesNotMatch',
            'ok 1 regex arg must be a regex',
            'ok 2 string arg must be a string',
            'not ok 3 The input was expected to not match the regular expression /string/. Input: \'string\'',
            '  ---',
            '    operator: doesNotMatch',
            '    expected: /string/',
            '    actual:   \'string\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: The input was expected to not match the regular expression /string/. Input: \'string\'',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            'not ok 4 "string" should not match /string/',
            '  ---',
            '    operator: doesNotMatch',
            '    expected: /string/',
            '    actual:   \'string\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: "string" should not match /string/',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            'not ok 5 The input was expected to not match the regular expression /pass$/. Input: \'I will pass\'',
            '  ---',
            '    operator: doesNotMatch',
            '    expected: /pass$/',
            '    actual:   \'I will pass\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: The input was expected to not match the regular expression /pass$/. Input: \'I will pass\'',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            'not ok 6 "I will pass" should not match /pass$/',
            '  ---',
            '    operator: doesNotMatch',
            '    expected: /pass$/',
            '    actual:   \'I will pass\'',
            '    at: Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '    stack: |-',
            '      Error: "I will pass" should not match /pass$/',
            '          [... stack stripped ...]',
            '          at Test.<anonymous> ($TEST/match.js:$LINE:$COL)',
            '          [... stack stripped ...]',
            '  ...',
            '',
            '1..6',
            '# tests 6',
            '# pass  2',
            '# fail  4',
            ''
        ]);
    };

    test.createStream().pipe(concat(tc));

    test('doesNotMatch', function (t) {
        t.plan(6);

        t['throws'](
            function () { t.doesNotMatch(/abc/, 'string'); },
            TypeError,
            'regex arg must be a regex'
        );

        t['throws'](
            function () { t.doesNotMatch({ abc: 123 }, /abc/); },
            TypeError,
            'string arg must be a string'
        );

        t.doesNotMatch('string', /string/);
        t.doesNotMatch('string', /string/, '"string" should not match /string/');

        t.doesNotMatch('I will pass', /pass$/);
        t.doesNotMatch('I will pass', /pass$/, '"I will pass" should not match /pass$/');

        t.end();
    });
});
