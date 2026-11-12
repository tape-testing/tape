'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var satisfies = require('semver').satisfies;

var stripFullStack = require('./common').stripFullStack;

// node added the `beforeExit` event in v0.11.12; before that, a test that never ends still blocks the tests after it
var noBeforeExit = !satisfies(process.version, '>= 0.11.12') && 'node < 0.11.12 has no `beforeExit` event';

tap.test('exit ok', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'exit', 'ok.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(rows, [
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
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});

tap.test('exit fail', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'exit', 'fail.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('too few exit', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/too_few.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('more planned in a second test', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/second.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('todo passing', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/todo.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});

tap.test('todo failing', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/todo_fail.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});

tap.test('forgot to call t.end()', function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/missing_end.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
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
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('forgot to call t.end(), later tests still run', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/missing_end_then_more.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# oops forgot end',
			'ok 1 should be truthy',
			'not ok 2 test exited without ending: oops forgot end',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: oops forgot end',
			'          [... stack stripped ...]',
			'  ...',
			'# still runs',
			'ok 3 should be truthy',
			'',
			'1..3',
			'# tests 3',
			'# pass  2',
			'# fail  1',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('too few assertions for the plan, later tests still run', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/too_few_then_more.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# too few',
			'ok 1 should be truthy',
			'not ok 2 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 2',
			'    actual:   1',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# still runs',
			'ok 3 should be truthy',
			'',
			'1..3',
			'# tests 3',
			'# pass  2',
			'# fail  1',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('subtest forgot to call st.end(), later tests still run', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/missing_end_subtest.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# parent',
			'# child forgot end',
			'ok 1 should be truthy',
			'not ok 2 test exited without ending: child forgot end',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: child forgot end',
			'          [... stack stripped ...]',
			'  ...',
			'# sibling still runs',
			'ok 3 should be truthy',
			'# next test still runs',
			'ok 4 should be truthy',
			'',
			'1..4',
			'# tests 4',
			'# pass  3',
			'# fail  1',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('a test finished from another `beforeExit` listener still passes', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/finished_in_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# finished from another beforeExit listener',
			'ok 1 late',
			'# next',
			'ok 2 should be truthy',
			'',
			'1..2',
			'# tests 2',
			'# pass  2',
			'',
			'# ok',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.equal(code, 0);
	});
});

tap.test('planned parent with a queued subtest waits for the subtest', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/planned_parent_stalled_child.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# parent',
			'ok 1 should be truthy',
			'not ok 2 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 3',
			'    actual:   1',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# child',
			'ok 3 should be truthy',
			'not ok 4 test exited without ending: child',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: child',
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 5 should be truthy',
			'',
			'1..5',
			'# tests 5',
			'# pass  3',
			'# fail  2',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('two stalled subtests in a row, later tests still run', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/stalled_subtests_in_a_row.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# parent',
			'# child',
			'ok 1 should be truthy',
			'not ok 2 test exited without ending: child',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: child',
			'          [... stack stripped ...]',
			'  ...',
			'# child2',
			'ok 3 should be truthy',
			'not ok 4 test exited without ending: child2',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: child2',
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 5 should be truthy',
			'',
			'1..5',
			'# tests 5',
			'# pass  3',
			'# fail  2',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('planned parent whose only subtest stalls, later tests still run', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/planned_parent_only_child_stalls.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# parent',
			'not ok 1 plan != count',
			'  ---',
			'    operator: fail',
			'    expected: 3',
			'    actual:   0',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# child',
			'ok 2 should be truthy',
			'not ok 3 test exited without ending: child',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: test exited without ending: child',
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 4 should be truthy',
			'',
			'1..4',
			'# tests 4',
			'# pass  2',
			'# fail  2',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});
