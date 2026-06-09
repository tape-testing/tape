'use strict';

/** @template {object} T @typedef {Record<keyof T, T[keyof T]>} AsRecord */

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var mockProperty = require('mock-property');
var now = require('@ljharb/now');

var stripFullStack = require('./common').stripFullStack;

tap.test('timeoutAfter test', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# timeoutAfter',
			'not ok 1 timeoutAfter timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: timeoutAfter timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);
	}));

	test('timeoutAfter', function (t) {
		t.plan(1);
		t.timeoutAfter(1);
	});
});

tap.test('timeoutAfter, blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# timeoutAfter, blocking',
			'ok 1 slow success',
			'not ok 2 timeoutAfter, blocking timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: timeoutAfter, blocking timed out after 1ms',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			''
		]);
	}));

	test('timeoutAfter, blocking', { ignoreSyncTimeout: false }, function (t) {
		t.timeoutAfter(1);
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('timeoutAfter, blocking, non-strict (default)', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# timeoutAfter, blocking, non-strict',
			'ok 1 slow success',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			''
		]);
	}));

	test('timeoutAfter, blocking, non-strict', function (t) {
		t.timeoutAfter(1);
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('opts.timeout, blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# opts.timeout, blocking',
			'ok 1 slow success',
			'not ok 2 opts.timeout, blocking timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: opts.timeout, blocking timed out after 1ms',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			''
		]);
	}));

	test('opts.timeout, blocking', { timeout: 1, ignoreSyncTimeout: false }, function (t) {
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('NODE_TAPE_STRICT_TIMEOUT, blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# NODE_TAPE_STRICT_TIMEOUT, blocking',
			'ok 1 slow success',
			'not ok 2 NODE_TAPE_STRICT_TIMEOUT, blocking timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NODE_TAPE_STRICT_TIMEOUT, blocking timed out after 1ms',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			''
		]);
	}));

	tt.teardown(mockProperty(
		/** @type {AsRecord<typeof process.env>} */ (process.env),
		'NODE_TAPE_STRICT_TIMEOUT',
		{ value: '1' }
	));

	test('NODE_TAPE_STRICT_TIMEOUT, blocking', { timeout: 1 }, function (t) {
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('NODE_TAPE_STRICT_TIMEOUT empty, blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# NODE_TAPE_STRICT_TIMEOUT empty, blocking',
			'ok 1 slow success',
			'',
			'1..1',
			'# tests 1',
			'# pass  1',
			'',
			'# ok',
			''
		]);
	}));

	tt.teardown(mockProperty(
		/** @type {AsRecord<typeof process.env>} */ (process.env),
		'NODE_TAPE_STRICT_TIMEOUT',
		{ value: '' }
	));

	test('NODE_TAPE_STRICT_TIMEOUT empty, blocking', { timeout: 1 }, function (t) {
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('NODE_TAPE_STRICT_TIMEOUT zero, blocking', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# NODE_TAPE_STRICT_TIMEOUT zero, blocking',
			'ok 1 slow success',
			'not ok 2 NODE_TAPE_STRICT_TIMEOUT zero, blocking timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    at: Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: NODE_TAPE_STRICT_TIMEOUT zero, blocking timed out after 1ms',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/timeoutAfter.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  1',
			'# fail  1',
			''
		]);
	}));

	tt.teardown(mockProperty(
		/** @type {AsRecord<typeof process.env>} */ (process.env),
		'NODE_TAPE_STRICT_TIMEOUT',
		{ value: '0' }
	));

	test('NODE_TAPE_STRICT_TIMEOUT zero, blocking', { timeout: 1 }, function (t) {
		var start = now();
		var current = start;
		while (current < start + 10) { current = now(); }
		t.pass('slow success');
		t.end();
	});
});

tap.test('timeoutAfter with Promises', { skip: typeof Promise === 'undefined' }, function (tt) {
	tt.plan(1);

	var test = tape.createHarness();

	test.createStream().pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# timeoutAfter with promises',
			'# fulfilled promise',
			'not ok 1 fulfilled promise timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: fulfilled promise timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'# rejected promise',
			'not ok 2 rejected promise timed out after 1ms',
			'  ---',
			'    operator: fail',
			'    stack: |-',
			'      Error: rejected promise timed out after 1ms',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..2',
			'# tests 2',
			'# pass  0',
			'# fail  2',
			''
		]);
	}));

	test('timeoutAfter with promises', function (t) {
		t.plan(2);

		t.test('fulfilled promise', function (st) {
			st.plan(1);
			st.timeoutAfter(1);

			return /** @type {Promise<void>} */ (new Promise(function (resolve) {
				setTimeout(function () {
					resolve();
				}, 10);
			}));
		});

		t.test('rejected promise', function (st) {
			st.plan(1);
			st.timeoutAfter(1);

			return /** @type {Promise<void>} */ (new Promise(function (reject) {
				setTimeout(function () {
					reject();
				}, 10);
			}));
		});
	});
});
