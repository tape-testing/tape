'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('callback returning rejected promise should cause that test (and only that test) to fail', function (tt) {
    tt.plan(1);

    var ps = spawn(process.execPath, [path.join(__dirname, 'promises', 'fail.js')]);

    ps.stdout.pipe(concat(function (rows) {
        var rowsString = rows.toString('utf8');

        if ((/^skip\n$/).test(rowsString)) {
            tt.pass('the test file indicated it should be skipped');
            return;
        }

        var strippedString = stripFullStack(rowsString).filter(function (line) {
            return !(/^(\s+)at(\s+)(?:Test\.)?<anonymous>(?:$|\s)/).test(line);
        }).join('\n');

        // hack for consistency across all versions of node
        // some versions produce a longer stack trace for some reason
        // since this doesn't affect the validity of the test, the extra line is removed if present
        // the regex just removes the lines "at <anonymous>" and "[... stack stripped ...]" if they occur together
        strippedString = strippedString
            .replace(/.+at (?:Test\.)?<anonymous>\n.+\[\.\.\. stack stripped \.\.\.\]\n/g, '')
            .replace(/(?:(.+)\[\.\.\. stack stripped \.\.\.\]\n)+/g, '$1[... stack stripped ...]\n');

        tt.same(strippedString, [
            'TAP version 13',
            '# promise',
            'not ok 1 Error: rejection message',
            '  ---',
            '    operator: error',
            '    stack: |-',
            '      Error: rejection message',
            '          at $TEST/promises/fail.js:$LINE:$COL',
            '          [... stack stripped ...]',
            '  ...',
            '# after',
            'ok 2 should be truthy',
            '',
            '1..2',
            '# tests 2',
            '# pass  1',
            '# fail  1',
            '',
            ''
        ].join('\n'));
    }));
});

tap.test('subtest callback returning rejected promise should cause that subtest (and only that subtest) to fail', function (tt) {
    tt.plan(1);

    var ps = spawn(process.execPath, [path.join(__dirname, 'promises', 'subTests.js')]);

    ps.stdout.pipe(concat(function (rows) {
        var rowsString = rows.toString('utf8');

        if ((/^skip\n$/).test(rowsString)) {
            tt.pass('the test file indicated it should be skipped');
            return;
        }

        var strippedString = stripFullStack(rowsString).filter(function (line) {
            return !(/^(\s+)at(\s+)(?:Test\.)?<anonymous>(?:$|\s)/).test(line);
        }).join('\n');

        // hack for consistency across all versions of node
        // some versions produce a longer stack trace for some reason
        // since this doesn't affect the validity of the test, the extra line is removed if present
        // the regex just removes the lines "at <anonymous>" and "[... stack stripped ...]" if they occur together
        strippedString = strippedString
            .replace(/.+at (?:Test\.)?<anonymous>\n.+\[\.\.\. stack stripped \.\.\.\]\n/, '')
            .replace(/(?:(.+)\[\.\.\. stack stripped \.\.\.\]\n)+/g, '$1[... stack stripped ...]\n');

        tt.same(stripFullStack(strippedString), [
            'TAP version 13',
            '# promise',
            '# sub test that should fail',
            'not ok 1 Error: rejection message',
            '  ---',
            '    operator: error',
            '    stack: |-',
            '      Error: rejection message',
            '          at $TEST/promises/subTests.js:$LINE:$COL',
            '          [... stack stripped ...]',
            '  ...',
            '# sub test that should pass',
            'ok 2 should be truthy',
            '',
            '1..2',
            '# tests 2',
            '# pass  1',
            '# fail  1',
            '',
            ''
        ]);
    }));
});
