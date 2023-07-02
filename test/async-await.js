'use strict';

var tap = require('tap');

var stripFullStack = require('./common').stripFullStack;
var runProgram = require('./common').runProgram;

var nodeVersion = process.versions.node;
var majorVersion = nodeVersion.split('.')[0];

if (Number(majorVersion) < 8) {
	process.exit(0); // eslint-disable-line no-process-exit
}

var node17 = Number(majorVersion) >= 17;

var lengthMessage = 'Cannot read property \'length\' of null';
try {
	lengthMessage = null.length;
} catch (e) {
	lengthMessage = e.message; // differs in v8 6.9+ (node 16.9+)
}

tap.test('async1', function (t) {
	runProgram('async-await', 'async1.js', function (r) {
		t.deepEqual(stripFullStack(r.stdout.toString('utf8')), [
			'TAP version 13',
			'# async1',
			'ok 1 before await',
			'ok 2 after await',
			'',
			'1..2',
			'# tests 2',
			'# pass  2',
			'',
			'# ok',
			'',
			''
		]);
		t.same(r.exitCode, 0);
		t.same(r.stderr.toString('utf8'), '');
		t.end();
	});
});

tap.test('async2', function (t) {
	runProgram('async-await', 'async2.js', function (r) {
		var stdout = r.stdout.toString('utf8');
		var lines = stdout.split('\n').filter(function (line) {
			return !(/^(\s+)at(\s+)<anonymous>$/).test(line);
		});

		t.deepEqual(stripFullStack(lines.join('\n')), [
			'TAP version 13',
			'# async2',
			'ok 1 before await',
			'not ok 2 after await',
			'  ---',
			'    operator: ok',
			'    expected: true',
			'    actual:   false',
			'    at: Test.myTest ($TEST/async-await/async2.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: after await',
			'          [... stack stripped ...]',
			'          at Test.myTest ($TEST/async-await/async2.js:$LINE:$COL)',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			'',
			''
		]);
		t.same(r.exitCode, 1);
		t.same(r.stderr.toString('utf8'), '');
		t.end();
	});
});

tap.test('async3', function (t) {
	runProgram('async-await', 'async3.js', function (r) {
		t.deepEqual(stripFullStack(r.stdout.toString('utf8')), [
			'TAP version 13',
			'# async3',
			'ok 1 before await',
			'ok 2 after await',
			'',
			'1..2',
			'# tests 2',
			'# pass  2',
			'',
			'# ok',
			'',
			''
		]);
		t.same(r.exitCode, 0);
		t.same(r.stderr.toString('utf8'), '');
		t.end();
	});
});

tap.test('async4', function (t) {
	runProgram('async-await', 'async4.js', function (r) {
		t.deepEqual(stripFullStack(r.stdout.toString('utf8')), [
			'TAP version 13',
			'# async4',
			'ok 1 before await',
			'not ok 2 Error: oops',
			'  ---',
			'    operator: error',
			'    at: Test.myTest ($TEST/async-await/async4.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: oops',
			'          at Timeout.myTimeout [as _onTimeout] ($TEST/async-await/async4.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			'',
			''
		]);
		t.same(r.exitCode, 1);
		t.same(r.stderr.toString('utf8'), '');
		t.end();
	});
});

tap.test('async5', function (t) {
	runProgram('async-await', 'async5.js', function (r) {
		t.same(stripFullStack(r.stdout.toString('utf8')), [
			'TAP version 13',
			'# async5',
			'ok 1 before server',
			'ok 2 after server',
			'ok 3 before request',
			'ok 4 after request',
			'ok 5 res.statusCode is 200',
			'not ok 6 .end() already called: mockDb.state is new',
			'  ---',
			'    operator: fail',
			'    at: Timeout._onTimeout ($TEST/async-await/async5.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: .end() already called: mockDb.state is new',
			'          [... stack stripped ...]',
			'          at Timeout._onTimeout ($TEST/async-await/async5.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 7 .end() already called: error on close',
			'  ---',
			'    operator: fail',
			'    at: Server.<anonymous> ($TEST/async-await/async5.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: .end() already called: error on close',
			'          [... stack stripped ...]',
			'          at Server.<anonymous> ($TEST/async-await/async5.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'not ok 8 .end() already called',
			'  ---',
			'    operator: fail',
			'    at: Server.<anonymous> ($TEST/async-await/async5.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: .end() already called',
			'          [... stack stripped ...]',
			'          at Server.<anonymous> ($TEST/async-await/async5.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..8',
			'# tests 8',
			'# pass  5',
			'# fail  3',
			'',
			''
		]);
		t.same(r.exitCode, 1);
		t.same(r.stderr.toString('utf8'), '');
		t.end();
	});
});

tap.test('sync-error', function (t) {
	runProgram('async-await', 'sync-error.js', function (r) {
		t.same(stripFullStack(r.stdout.toString('utf8')), [
			'TAP version 13',
			'# sync-error',
			'ok 1 before throw',
			''
		]);
		t.same(r.exitCode, 1);

		var stderr = r.stderr.toString('utf8');
		var lines = stderr.split('\n');
		lines = lines.filter(function (line) {
			return !(/\(timers.js:/).test(line)
                && !(/\(internal\/timers.js:/).test(line)
                && !(/Immediate\.next/).test(line);
		});
		stderr = lines.join('\n');

		t.same(stripFullStack(stderr), [].concat(
			'$TEST/async-await/sync-error.js:7',
			'	throw new Error(\'oopsie\');',
			'	^',
			'',
			'Error: oopsie',
			'    at Test.myTest ($TEST/async-await/sync-error.js:$LINE:$COL)',
			'    at Test.run ($TAPE/lib/test.js:$LINE:$COL)',
			node17 ? [
				'',
				'Node.js ' + process.version
			] : [],
			''
		));
		t.end();
	});
});

tap.test('async-error', function (t) {
	runProgram('async-await', 'async-error.js', function (r) {
		var stdout = r.stdout.toString('utf8');
		var lines = stdout.split('\n');
		lines = lines.filter(function (line) {
			return !(/^(\s+)at(\s+)<anonymous>$/).test(line);
		});
		stdout = lines.join('\n');

		t.same(stripFullStack(stdout), [
			'TAP version 13',
			'# async-error',
			'ok 1 before throw',
			'not ok 2 Error: oopsie',
			'  ---',
			'    operator: error',
			'    stack: |-',
			'      Error: oopsie',
			'          at Test.myTest ($TEST/async-await/async-error.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			'',
			''
		]);
		t.same(r.exitCode, 1);

		var stderr = r.stderr.toString('utf8');
		var stderrLines = stderr.split('\n').filter(function (line) {
			return !(/\(timers.js:/).test(line)
                && !(/\(internal\/timers.js:/).test(line)
                && !(/Immediate\.next/).test(line);
		});

		t.same(stderrLines.join('\n'), '');
		t.end();
	});
});

tap.test('async-bug', function (t) {
	runProgram('async-await', 'async-bug.js', function (r) {
		var stdout = r.stdout.toString('utf8');
		var lines = stdout.split('\n');
		lines = lines.filter(function (line) {
			return !(/^(\s+)at(\s+)<anonymous>$/).test(line);
		});
		stdout = lines.join('\n');

		t.same(stripFullStack(stdout), [
			'TAP version 13',
			'# async-error',
			'ok 1 before throw',
			'ok 2 should be strictly equal',
			'not ok 3 TypeError: ' + lengthMessage,
			'  ---',
			'    operator: error',
			'    stack: |-',
			'      TypeError: ' + lengthMessage,
			'          at myCode ($TEST/async-await/async-bug.js:$LINE:$COL)',
			'          at Test.myTest ($TEST/async-await/async-bug.js:$LINE:$COL)',
			'  ...',
			'',
			'1..3',
			'# tests 3',
			'# pass  2',
			'# fail  1',
			'',
			''
		]);
		t.same(r.exitCode, 1);

		var stderr = r.stderr.toString('utf8');

		t.same(stderr, '');
		t.end();
	});
});
