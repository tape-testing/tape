'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var tapParser = require('tap-parser');
var common = require('./common');

var getDiag = common.getDiag;
var stripFullStack = common.stripFullStack;

tap.test('deep equal failure', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat({ encoding: 'string' }, function (body) {
		assert.deepEqual(stripFullStack(body), [
			'TAP version 13',
			'# not deep equal',
			'not ok 1 should not be deeply equivalent',
			'  ---',
			'    operator: notDeepEqual',
			'    expected: |-',
			'      { b: 2 }',
			'    actual: |-',
			'      { b: 2 }',
			'    at: Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should not be deeply equivalent',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);

		assert.deepEqual(getDiag(body), {
			operator: 'notDeepEqual',
			expected: '{ b: 2 }',
			actual: '{ b: 2 }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should not be deeply equivalent',
			diag: {
				operator: 'notDeepEqual',
				expected: '{ b: 2 }',
				actual: '{ b: 2 }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('not deep equal', function (t) {
		t.plan(1);
		t.notDeepEqual({ b: 2 }, { b: 2 });
	});
});

tap.test('not deep equal failure, depth 6, with option', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat({ encoding: 'string' }, function (body) {
		assert.deepEqual(stripFullStack(body), [
			'TAP version 13',
			'# not deep equal',
			'not ok 1 should not be deeply equivalent',
			'  ---',
			'    operator: notDeepEqual',
			'    expected: |-',
			'      { a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
			'    actual: |-',
			'      { a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
			'    at: Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should not be deeply equivalent',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);

		assert.deepEqual(getDiag(body), {
			operator: 'notDeepEqual',
			expected: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
			actual: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should not be deeply equivalent',
			diag: {
				operator: 'notDeepEqual',
				expected: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
				actual: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('not deep equal', { objectPrintDepth: 6 }, function (t) {
		t.plan(1);
		t.notDeepEqual({ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }, { a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } });
	});
});

tap.test('not deep equal failure, depth 6, without option', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat({ encoding: 'string' }, function (body) {
		assert.deepEqual(stripFullStack(body), [
			'TAP version 13',
			'# not deep equal',
			'not ok 1 should not be deeply equivalent',
			'  ---',
			'    operator: notDeepEqual',
			'    expected: |-',
			'      { a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			'    actual: |-',
			'      { a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			'    at: Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should not be deeply equivalent',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/not-deep-equal-failure.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..1',
			'# tests 1',
			'# pass  0',
			'# fail  1',
			''
		]);

		assert.deepEqual(getDiag(body), {
			operator: 'notDeepEqual',
			expected: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			actual: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should not be deeply equivalent',
			diag: {
				operator: 'notDeepEqual',
				expected: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
				actual: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('not deep equal', function (t) {
		t.plan(1);
		t.notDeepEqual({ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }, { a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } });
	});
});
