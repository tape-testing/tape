'use strict';

var tape = require('../');
var tap = require('tap');
var spawn = require('child_process').spawn;
var url = require('url');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var assign = require('object.assign');
var hasDynamicImport = require('has-dynamic-import');
var common = require('./common');

var getDiag = common.getDiag;

function stripAt(body) {
	return body.replace(/^\s*at:\s+Test.*$\n/m, '');
}

function isString(x) {
	return typeof x === 'string';
}

tap.test('preserves stack trace with newlines', function (tt) {
	tt.plan(3);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());
	var stackTrace = 'foo\n  bar';

	parser.once('assert', function (data) {
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'Error: Preserve stack',
			diag: {
				stack: stackTrace,
				operator: 'error',
				at: data.diag.at // we don't care about this one
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [
			'TAP version 13',
			'# multiline stack trace',
			'not ok 1 Error: Preserve stack',
			'  ---',
			'    operator: error',
			'    stack: |-',
			'      foo',
			'        bar',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stackTrace,
			operator: 'error'
		});
	}));

	test('multiline stack trace', function (t) {
		t.plan(1);
		var err = new Error('Preserve stack');
		err.stack = stackTrace;
		t.error(err);
	});
});

tap.test('parses function info from original stack', function (tt) {
	tt.plan(4);

	var test = tape.createHarness();
	test.createStream();

	test._results._watch = function (t) {
		t.on('result', function (res) {
			tt.equal('Test.testFunctionNameParsing', res.functionName);
			tt.match(res.file, /stackTrace.js/i);
			tt.ok(Number(res.line) > 0);
			tt.ok(Number(res.column) > 0);
		});
	};

	test('t.equal stack trace', function testFunctionNameParsing(t) {
		t.equal(true, false, 'true should be false');
		t.end();
	});
});

tap.test('parses function info from original stack for anonymous function', function (tt) {
	tt.plan(4);

	var test = tape.createHarness();
	test.createStream();

	test._results._watch = function (t) {
		t.on('result', function (res) {
			tt.equal('Test.<anonymous>', res.functionName);
			tt.match(res.file, /stackTrace.js/i);
			tt.ok(Number(res.line) > 0);
			tt.ok(Number(res.column) > 0);
		});
	};

	test('t.equal stack trace', function (t) {
		t.equal(true, false, 'true should be false');
		t.end();
	});
});

if (typeof Promise === 'function' && typeof Promise.resolve === 'function') {

	tap.test('parses function info from original stack for Promise scenario', function (tt) {
		tt.plan(4);

		var test = tape.createHarness();
		test.createStream();

		test._results._watch = function (t) {
			t.on('result', function (res) {
				tt.equal('onfulfilled', res.functionName);
				tt.match(res.file, /stackTrace.js/i);
				tt.ok(Number(res.line) > 0);
				tt.ok(Number(res.column) > 0);
			});
		};

		test('t.equal stack trace', function testFunctionNameParsing(t) {
			new Promise(function (resolve) {
				resolve();
			}).then(function onfulfilled() {
				t.equal(true, false, 'true should be false');
				t.end();
			});
		});
	});

	tap.test('parses function info from original stack for Promise scenario with anonymous function', function (tt) {
		tt.plan(4);

		var test = tape.createHarness();
		test.createStream();

		test._results._watch = function (t) {
			t.on('result', function (res) {
				tt.equal('<anonymous>', res.functionName);
				tt.match(res.file, /stackTrace.js/i);
				tt.ok(Number(res.line) > 0);
				tt.ok(Number(res.column) > 0);
			});
		};

		test('t.equal stack trace', function testFunctionNameParsing(t) {
			new Promise(function (resolve) {
				resolve();
			}).then(function () {
				t.equal(true, false, 'true should be false');
				t.end();
			});
		});
	});

}

tap.test('preserves stack trace for failed assertions', function (tt) {
	tt.plan(6);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());

	var stack = '';
	parser.once('assert', function (data) {
		tt.equal(typeof data.diag.at, 'string');
		tt.equal(typeof data.diag.stack, 'string');
		var at = data.diag.at || '';
		stack = data.diag.stack || '';
		tt.ok((/^Error: true should be false(\n {4}at .+)+/).exec(stack), 'stack should be a stack');
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'true should be false',
			diag: {
				at: at,
				stack: stack,
				operator: 'equal',
				expected: false,
				actual: true
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [].concat(
			'TAP version 13',
			'# t.equal stack trace',
			'not ok 1 true should be false',
			'  ---',
			'    operator: equal',
			'    expected: false',
			'    actual:   true',
			'    stack: |-',
			stack.split('\n').map(function (x) { return '      ' + x; }),
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		));

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stack,
			operator: 'equal',
			expected: false,
			actual: true
		});
	}));

	test('t.equal stack trace', function (t) {
		t.plan(1);
		t.equal(true, false, 'true should be false');
	});
});

tap.test('preserves stack trace for failed assertions where actual===falsy', function (tt) {
	tt.plan(6);

	var test = tape.createHarness();
	var stream = test.createStream();
	var parser = stream.pipe(tapParser());

	var stack = '';
	parser.once('assert', function (data) {
		tt.equal(typeof data.diag.at, 'string');
		tt.equal(typeof data.diag.stack, 'string');
		var at = data.diag.at || '';
		stack = data.diag.stack || '';
		tt.ok((/^Error: false should be true(\n {4}at .+)+/).exec(stack), 'stack should be a stack');
		tt.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'false should be true',
			diag: {
				at: at,
				stack: stack,
				operator: 'equal',
				expected: true,
				actual: false
			}
		});
	});

	stream.pipe(concat(function (body) {
		var strippedBody = stripAt(body.toString('utf8'));
		tt.deepEqual(strippedBody.split('\n'), [].concat(
			'TAP version 13',
			'# t.equal stack trace',
			'not ok 1 false should be true',
			'  ---',
			'    operator: equal',
			'    expected: true',
			'    actual:   false',
			'    stack: |-',
			stack.split('\n').map(function (x) { return '      ' + x; }),
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		));

		tt.deepEqual(getDiag(strippedBody, true), {
			stack: stack,
			operator: 'equal',
			expected: true,
			actual: false
		});
	}));

	test('t.equal stack trace', function (t) {
		t.plan(1);
		t.equal(false, true, 'false should be true');
	});
});

function spawnTape(args, options) {
	var bin = __dirname + '/../bin/tape';

	return spawn(process.execPath, [bin].concat(args.split(' ')), assign({ cwd: __dirname }, options));
}

function processRows(rows) {
	return (typeof rows === 'string' ? rows.split('\n') : rows).map(common.stripChangingData).filter(isString).join('\n');
}

tap.test('CJS vs ESM: `at`', function (tt) {
	tt.plan(2);

	tt.test('CJS', function (ttt) {
		ttt.plan(2);

		var tc = function (rows) {
			ttt.same(processRows(rows.toString('utf8')), processRows([
				'TAP version 13',
				'# test',
				'not ok 1 should be strictly equal',
				'  ---',
				'    operator: equal',
				'    expected: \'foobar\'',
				'    actual:   \'foobaz\'',
				'    at: Test.<anonymous> ($TEST/stack_trace/cjs.js:7:4)',
				'    stack: |-',
				'      Error: should be strictly equal',
				'          at Test.assert [as _assert] ($TAPE/lib/test.js:$LINE:$COL)',
				'          at Test.strictEqual ($TAPE/lib/test.js:$LINE:$COL)',
				'          at Test.<anonymous> ($TEST/stack_trace/cjs.js:7:4)',
				'          at Test.run ($TAPE/lib/test.js:$LINE:$COL)',
				'          at Immediate.next ($TAPE/lib/results.js:$LINE:$COL)',
				'          at processImmediate (timers:$LINE:$COL)',
				'  ...',
				'',
				'1..1',
				'# tests 1',
				'# pass  0',
				'# fail  1',
				'',
				''
			]));
		};

		var ps = spawnTape('stack_trace/cjs.js');
		ps.stdout.pipe(concat(tc));
		ps.stderr.pipe(process.stderr);
		ps.on('exit', function (code) {
			ttt.notEqual(code, 0);
			ttt.end();
		});
	});

	hasDynamicImport().then(function (hasSupport) {
		tt.test('ESM', { skip: !url.pathToFileURL || !hasSupport }, function (ttt) {
			ttt.plan(2);

			var tc = function (rows) {
				ttt.same(processRows(rows.toString('utf8')), processRows([
					'TAP version 13',
					'# test',
					'not ok 1 should be strictly equal',
					'  ---',
					'    operator: equal',
					'    expected: \'foobar\'',
					'    actual:   \'foobaz\'',
					'    at: Test.<anonymous> (' + url.pathToFileURL(__dirname + '/stack_trace/esm.mjs:5:4') + ')',
					'    stack: |-',
					'      Error: should be strictly equal',
					'          at Test.assert [as _assert] ($TAPE/lib/test.js:$LINE:$COL)',
					'          at Test.strictEqual ($TAPE/lib/test.js:$LINE:$COL)',
					'          at Test.<anonymous> (' + url.pathToFileURL(__dirname + '/stack_trace/esm.mjs:5:4') + ')',
					'          at Test.run ($TAPE/lib/test.js:$LINE:$COL)',
					'          at Immediate.next ($TAPE/lib/results.js:$LINE:$COL)',
					// node ?
					// at runCallback (timers.js:$LINE:$COL)
					'          at process.processImmediate (node:internal/timers:478:21)',
					'  ...',
					'',
					'1..1',
					'# tests 1',
					'# pass  0',
					'# fail  1',
					'',
					''
				]));
			};

			var ps = spawnTape('stack_trace/esm.mjs');
			ps.stdout.pipe(concat(tc));
			ps.stderr.pipe(process.stderr);
			ps.on('exit', function (code) {
				ttt.equal(code, 1);
				ttt.end();
			});
		});
	});
});
