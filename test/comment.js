'use strict';

var concat = require('concat-stream');
var tap = require('tap');
var tape = require('../');

// Exploratory test to ascertain proper output when no t.comment() call
// is made.
tap.test('no comment', function (assert) {
	assert.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		assert.deepEqual(output.split('\n'), [
			'TAP version 13',
			'# no comment',
			'',
			'1..0',
			'# tests 0',
			'# pass  0',
			'',
			'# ok',
			''
		]);
	}));
	test('no comment', function (t) {
		t.end();
	});
});

// Exploratory test, can we call t.comment() passing nothing?
tap.test('missing argument', function (assert) {
	assert.plan(1);
	var test = tape.createHarness();
	test.createStream();
	test('missing argument', function (t) {
		try {
			// @ts-expect-error
			t.comment();
			t.end();
		} catch (err) {
			assert.equal(/** @type {Error} */ (err).constructor, TypeError);
		} finally {
			assert.end();
		}
	});
});

// Exploratory test, can we call t.comment() passing nothing?
tap.test('null argument', function (assert) {
	assert.plan(1);
	var test = tape.createHarness();
	test.createStream();
	test('null argument', function (t) {
		try {
			// @ts-expect-error
			t.comment(null);
			t.end();
		} catch (err) {
			assert.equal(/** @type {Error} */ (err).constructor, TypeError);
		} finally {
			assert.end();
		}
	});
});

// Exploratory test, how is whitespace treated?
tap.test('whitespace', function (assert) {
	assert.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		assert.equal(output, [
			'TAP version 13',
			'# whitespace',
			'# ',
			'# a',
			'# a',
			'# a',
			'',
			'1..0',
			'# tests 0',
			'# pass  0',
			'',
			'# ok',
			''
		].join('\n'));
	}));
	test('whitespace', function (t) {
		t.comment(' ');
		t.comment(' a');
		t.comment('a ');
		t.comment(' a ');
		t.end();
	});
});

// Exploratory test, how about passing types other than strings?
tap.test('non-string types', function (assert) {
	assert.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		assert.equal(output, [
			'TAP version 13',
			'# non-string types',
			'# true',
			'# false',
			'# 42',
			'# 6.66',
			'# [object Object]',
			'# [object Object]',
			'# [object Object]',
			'# function ConstructorFunction() {}',
			'',
			'1..0',
			'# tests 0',
			'# pass  0',
			'',
			'# ok',
			''
		].join('\n'));
	}));

	test('non-string types', function (t) {
		// @ts-expect-error
		t.comment(true);
		// @ts-expect-error
		t.comment(false);
		// @ts-expect-error
		t.comment(42);
		// @ts-expect-error
		t.comment(6.66);
		// @ts-expect-error
		t.comment({});
		// @ts-expect-error
		t.comment({ answer: 42 });
		/** @constructor */
		function ConstructorFunction() {}
		// @ts-expect-error
		t.comment(new ConstructorFunction());
		// @ts-expect-error
		t.comment(ConstructorFunction);
		t.end();
	});
});

tap.test('multiline string', function (assert) {
	assert.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		assert.equal(output, [
			'TAP version 13',
			'# multiline strings',
			'# a',
			'# b',
			'# c',
			'# d',
			'',
			'1..0',
			'# tests 0',
			'# pass  0',
			'',
			'# ok',
			''
		].join('\n'));
	}));
	test('multiline strings', function (t) {
		t.comment([
			'a',
			'b'
		].join('\n'));
		t.comment([
			'c',
			'd'
		].join('\r\n'));
		t.end();
	});
});

tap.test('comment with createStream/objectMode', function (assert) {
	assert.plan(1);

	var test = tape.createHarness();
	test.createStream({ objectMode: true }).on('data', /** @param {unknown} row */ function (row) {
		if (typeof row === 'string') {
			assert.equal(row, 'comment message');
		}
	});
	test('t.comment', function (t) {
		t.comment('comment message');
		t.end();
	});
});
