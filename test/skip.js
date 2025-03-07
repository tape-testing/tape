'use strict';

var test = require('../');

var concat = require('concat-stream');
var tap = require('tap');

tap.test('test SKIP comment', function (assert) {
	assert.plan(1);

	var tapeTest = test.createHarness();
	tapeTest.createStream().pipe(concat({ encoding: 'string' }, function (output) {
		assert.equal(output, [
			'TAP version 13',
			'# SKIP skipped',
			'',
			'1..0',
			'# tests 0',
			'# pass  0',
			'',
			'# ok',
			''
		].join('\n'));
	}));
	tapeTest('skipped', { skip: true }, function (t) {
		t.end();
	});
});

test('skip this', { skip: true }, function (t) {
	t.fail('this should not even run');
	t.end();
});

// @ts-expect-error TODO FIXME not sure if this should be a valid type, because the cb is actually being treated as `extra` here
test.skip('skip this too', function (t) {
	t.fail('this should not even run');
	t.end();
});

test('skip subtest', function (t) {
	t.test('skip this', { skip: true }, function (st) {
		st.fail('this should not even run');
		st.end();
	});
	t.end();
});

// vim: set softtabstop=4 shiftwidth=4:
