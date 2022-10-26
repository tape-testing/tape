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
	stream.pipe(concat(function (body) {
		assert.deepEqual(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# deep equal',
			'not ok 1 should be strictly equal',
			'  ---',
			'    operator: equal',
			'    expected: |-',
			'      { b: 2 }',
			'    actual: |-',
			'      { a: 1 }',
			'    at: Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be strictly equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
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
			operator: 'equal',
			expected: '{ b: 2 }',
			actual: '{ a: 1 }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should be strictly equal',
			diag: {
				operator: 'equal',
				expected: '{ b: 2 }',
				actual: '{ a: 1 }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('deep equal', function (t) {
		t.plan(1);
		t.equal({ a: 1 }, { b: 2 });
	});
});

tap.test('deep equal failure, depth 6, with option', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat(function (body) {
		assert.deepEqual(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# deep equal',
			'not ok 1 should be strictly equal',
			'  ---',
			'    operator: equal',
			'    expected: |-',
			'      { a: { a1: { a2: { a3: { a4: { a5: 2 } } } } } }',
			'    actual: |-',
			'      { a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
			'    at: Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be strictly equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
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
			operator: 'equal',
			expected: '{ a: { a1: { a2: { a3: { a4: { a5: 2 } } } } } }',
			actual: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should be strictly equal',
			diag: {
				operator: 'equal',
				expected: '{ a: { a1: { a2: { a3: { a4: { a5: 2 } } } } } }',
				actual: '{ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('deep equal', { objectPrintDepth: 6 }, function (t) {
		t.plan(1);
		t.equal({ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }, { a: { a1: { a2: { a3: { a4: { a5: 2 } } } } } });
	});
});

tap.test('deep equal failure, depth 6, without option', function (assert) {
	var test = tape.createHarness({ exit: false });
	var stream = test.createStream();
	var parser = tapParser();
	assert.plan(3);

	stream.pipe(parser);
	stream.pipe(concat(function (body) {
		assert.deepEqual(stripFullStack(body.toString('utf8')), [
			'TAP version 13',
			'# deep equal',
			'not ok 1 should be strictly equal',
			'  ---',
			'    operator: equal',
			'    expected: |-',
			'      { a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			'    actual: |-',
			'      { a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			'    at: Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be strictly equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/deep-equal-failure.js:$LINE:$COL)',
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
			operator: 'equal',
			expected: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
			actual: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }'
		});
	}));

	parser.once('assert', function (data) {
		assert.deepEqual(data, {
			ok: false,
			id: 1,
			name: 'should be strictly equal',
			diag: {
				operator: 'equal',
				expected: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
				actual: '{ a: { a1: { a2: { a3: { a4: [Object] } } } } }',
				// we don't care about these next two
				stack: data.diag.stack,
				at: data.diag.at
			}
		});
	});

	test('deep equal', function (t) {
		t.plan(1);
		t.equal({ a: { a1: { a2: { a3: { a4: { a5: 1 } } } } } }, { a: { a1: { a2: { a3: { a4: { a5: 2 } } } } } });
	});
});
