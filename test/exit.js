'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var satisfies = require('semver').satisfies;

var stripFullStack = require('./common').stripFullStack;

// node added the `beforeExit` event in v0.11.12; before that, a test that never ends still blocks the tests after it
var noBeforeExit = !satisfies(process.version, '>= 0.11.12') && 'node < 0.11.12 has no `beforeExit` event';

var noPendingWorkInfo = noBeforeExit || (
	typeof /** @type {{ getActiveResourcesInfo?: unknown }} */ (process).getActiveResourcesInfo !== 'function'
	&& 'node < 16.14 can not report the work that `beforeExit` listeners schedule'
);

// where a stalled test fails: the `beforeExit` check, or the `exit` handler when there is no `beforeExit`
var stalledAt = noBeforeExit
	? '    at: process.<anonymous> ($TAPE/index.js:$LINE:$COL)'
	: '    at: checkForStall ($TAPE/index.js:$LINE:$COL)';

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
			stalledAt,
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
			stalledAt,
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
			'# todo  1',
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
			'# todo  1',
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
			stalledAt,
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
			stalledAt,
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
			stalledAt,
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
			stalledAt,
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

tap.test('a test ended by a beforeExit listener added in a later round still passes', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/finished_in_second_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# finished from a beforeExit listener added in a later round',
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
			stalledAt,
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# child',
			'ok 3 should be truthy',
			'not ok 4 test exited without ending: child',
			'  ---',
			'    operator: fail',
			stalledAt,
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
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: child',
			'          [... stack stripped ...]',
			'  ...',
			'# child2',
			'ok 3 should be truthy',
			'not ok 4 test exited without ending: child2',
			'  ---',
			'    operator: fail',
			stalledAt,
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
			stalledAt,
			'    stack: |-',
			'      Error: plan != count',
			'          [... stack stripped ...]',
			'  ...',
			'# child',
			'ok 2 should be truthy',
			'not ok 3 test exited without ending: child',
			'  ---',
			'    operator: fail',
			stalledAt,
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

tap.test('a test that asserts in every `beforeExit` still stalls, and does not keep the process alive', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/asserts_in_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# asserts whenever the event loop empties',
			'ok 1 checked',
			'ok 2 checked',
			'not ok 3 test exited without ending: asserts whenever the event loop empties',
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: asserts whenever the event loop empties',
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 4 should be truthy',
			'not ok 5 assertion after test exited without ending (asserts whenever the event loop empties): checked',
			'  ---',
			'    operator: fail',
			'    at: process.<anonymous> ($TEST/exit/asserts_in_before_exit.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: assertion after test exited without ending (asserts whenever the event loop empties): checked',
			'          [... stack stripped ...]',
			'          at process.<anonymous> ($TEST/exit/asserts_in_before_exit.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
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

tap.test('a test that a `beforeExit` listener added before tape\'s asserts in still stalls, and does not keep the process alive', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var name = 'asserts from a listener added before tape\'s';
	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/asserts_in_earlier_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		// node < 6 can not run tape's listener first, so tape keeps the test alive for a limited number of rounds instead
		var expected = typeof process.prependListener === 'function' ? [
			'TAP version 13',
			'# ' + name,
			'ok 1 checked',
			'ok 2 checked',
			'not ok 3 test exited without ending: ' + name,
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: ' + name,
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 4 should be truthy',
			'',
			'1..4',
			'# tests 4',
			'# pass  3',
			'# fail  1',
			'',
			''
		] : [
			'TAP version 13',
			'# ' + name,
			'ok 1 checked',
			'ok 2 checked',
			'ok 3 checked',
			'ok 4 checked',
			'ok 5 checked',
			'ok 6 checked',
			'ok 7 checked',
			'ok 8 checked',
			'ok 9 checked',
			'ok 10 checked',
			'ok 11 checked',
			'not ok 12 test exited without ending: ' + name,
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: ' + name,
			'          [... stack stripped ...]',
			'  ...',
			'# after',
			'ok 13 should be truthy',
			'',
			'1..13',
			'# tests 13',
			'# pass  12',
			'# fail  1',
			'',
			''
		];
		t.same(stripFullStack(rows), expected);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('a test that makes new assertions between `beforeExit` events is not stalled', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/asserts_between_before_exits.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# finished across two beforeExit events',
			'ok 1 first',
			'ok 2 second',
			'# next',
			'ok 3 should be truthy',
			'',
			'1..3',
			'# tests 3',
			'# pass  3',
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

tap.test('a test ended by a `beforeExit` listener that an earlier one scheduled is not stalled', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/ended_by_later_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# ended by a later beforeExit listener',
			'ok 1 done',
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

tap.test('a test waiting on work that `beforeExit` listeners keep scheduling is not stalled', { skip: noPendingWorkInfo }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/work_scheduled_in_before_exit.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# finished after several rounds of beforeExit work',
			'ok 1 done',
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

tap.test('orphaned subtests, whose parent already ended, are not failed', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/orphaned_subtests.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# subtest ends its parent',
			'# child',
			'ok 1 should be truthy',
			'# subtest added after its parent ended',
			'ok 2 should be truthy',
			'# after',
			'ok 3 should be truthy',
			'# late child',
			'ok 4 should be truthy',
			'',
			'1..4',
			'# tests 4',
			'# pass  4',
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

tap.test('a test whose teardown never settles fails once, and later tests still run', { skip: noBeforeExit || (typeof Promise !== 'function' && 'requires Promise') }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/teardown_never_settles.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# ended, teardown never settles',
			'ok 1 should be truthy',
			'not ok 2 test exited without ending: ended, teardown never settles',
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: ended, teardown never settles',
			'          [... stack stripped ...]',
			'  ...',
			'# not ended, teardown never settles',
			'ok 3 should be truthy',
			'not ok 4 test exited without ending: not ended, teardown never settles',
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: not ended, teardown never settles',
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

tap.test('a stalled test that finishes late names itself in its late failures', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/late_callbacks_after_stall.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# stalls, then finishes late',
			'not ok 1 test exited without ending: stalls, then finishes late',
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: stalls, then finishes late',
			'          [... stack stripped ...]',
			'  ...',
			'# next',
			'not ok 2 assertion after test exited without ending (stalls, then finishes late): late',
			'  ---',
			'    operator: fail',
			'    at: finish ($TEST/exit/late_callbacks_after_stall.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: assertion after test exited without ending (stalls, then finishes late): late',
			'          [... stack stripped ...]',
			'          at finish ($TEST/exit/late_callbacks_after_stall.js:$LINE:$COL)',
			'          at Test.<anonymous> ($TEST/exit/late_callbacks_after_stall.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 3 should be truthy',
			'',
			'1..3',
			'# tests 3',
			'# pass  1',
			'# fail  2',
			'',
			''
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		t.notEqual(code, 0);
	});
});

tap.test('a subtest that throws does not stop its parent from running its other subtests', { skip: noBeforeExit }, function (t) {
	t.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, '/exit/subtest_throws.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		t.same(stripFullStack(rows), [
			'TAP version 13',
			'# parent',
			'# child',
			'not ok 1 test exited without ending: child',
			'  ---',
			'    operator: fail',
			stalledAt,
			'    stack: |-',
			'      Error: test exited without ending: child',
			'          [... stack stripped ...]',
			'  ...',
			'# sibling',
			'ok 2 (unnamed assert)',
			'# next',
			'ok 3 (unnamed assert)',
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
