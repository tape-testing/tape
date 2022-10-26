'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('exit ok', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(rows.toString('utf8'), [
			'TAP version 13',
			'# array',
			'# hi',
			'ok 1 should be deeply equivalent',
			'ok 2 should be deeply equivalent',
			'ok 3 should be deeply equivalent',
			'ok 4 should be deeply equivalent',
			'ok 5 should be deeply equivalent',
			'',
			'1..5',
			'# tests 5',
			'# pass  5',
			'',
			'# ok',
			'', // yes, these double-blank-lines at the end are required.
			'' // if you can figure out how to remove them, please do!
		].join('\n'));
	};

	var ps = spawn(process.execPath, [path.join(__dirname, 'exit', 'ok.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.equal(code, 0);
	});
});

tap.test('exit fail', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# array',
			'ok 1 should be deeply equivalent',
			'ok 2 should be deeply equivalent',
			'ok 3 should be deeply equivalent',
			'ok 4 should be deeply equivalent',
			'not ok 5 should be deeply equivalent',
			'  ---',
			'    operator: deepEqual',
			'    expected: [ [ 1, 2, [ 3, 4444 ] ], [ 5, 6 ] ]',
			'    actual:   [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ]',
			'    at: <anonymous> ($TEST/exit/fail.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be deeply equivalent',
			'          [... stack stripped ...]',
			'          at $TEST/exit/fail.js:$LINE:$COL',
			'          at eval (eval at <anonymous> ($TEST/exit/fail.js:$LINE:$COL))',
			'          at eval (eval at <anonymous> ($TEST/exit/fail.js:$LINE:$COL))',
			'          at Test.<anonymous> ($TEST/exit/fail.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..5',
			'# tests 5',
			'# pass  4',
			'# fail  1',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, 'exit', 'fail.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('too few exit', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# array',
			'ok 1 should be deeply equivalent',
			'ok 2 should be deeply equivalent',
			'ok 3 should be deeply equivalent',
			'ok 4 should be deeply equivalent',
			'ok 5 should be deeply equivalent',
			'not ok 6 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 6',
			'    actual:   5',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..6',
			'# tests 6',
			'# pass  5',
			'# fail  1',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/too_few.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('more planned in a second test', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# first',
			'ok 1 should be truthy',
			'# second',
			'ok 2 should be truthy',
			'not ok 3 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 2',
			'    actual:   1',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..3',
			'# tests 3',
			'# pass  2',
			'# fail  1',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/second.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('todo passing', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# TODO todo pass',
			'ok 1 should be truthy # TODO',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/todo.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.equal(code, 0);
	});
});

tap.test('todo failing', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# TODO todo fail',
			'not ok 1 should be truthy # TODO',
			'  ---',
			'    operator: ok',
			'    expected: true',
			'    actual:   false',
			'    at: Test.<anonymous> ($TEST/exit/todo_fail.js:$LINE:$COL)',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/todo_fail.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.equal(code, 0);
	});
});

tap.test('forgot to call t.end()', function (t) {
	t.plan(2);

	var tc = function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# first',
			'ok 1 should be truthy',
			'# oops forgot end',
			'ok 2 should be truthy',
			'not ok 3 test exited without ending: oops forgot end',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: oops forgot end',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..3',
			'# tests 3',
			'# pass  2',
			'# fail  1',
			'',
			''
		]);
	};

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/missing_end.js')]);
	ps.stdout.pipe(concat(tc));
	ps.on('exit', function (code) {
		t.notEqual(code, 0);
	});
});
