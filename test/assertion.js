'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('using a custom assertion', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	var count = 0;
	test.createStream().pipe(concat(function (body) {
		tt.same(stripFullStack(body.toString('utf8')), [].concat(
			'TAP version 13',
			'# with a custom assertion',
			'ok ' + ++count + ' true is ok',
			'ok ' + ++count + ' value must be the answer to life, the universe, and everything',
			'ok ' + ++count + ' what is 6 * 9?',
			'not ok ' + ++count + ' what is 6 * 9!',
			'  ---',
			'    operator: equal',
			'    expected: 42',
			'    actual:   54',
			'    at: Test.isAnswer ($TEST/assertion.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: what is 6 * 9!',
			'          [... stack stripped ...]',
			'          at Test.isAnswer ($TEST/assertion.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/assertion.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  ' + (count - 1),
			'# fail  1',
			''
		));
	}));

	var isAnswer = function (value, msg) {
		// eslint-disable-next-line no-invalid-this
		this.equal(value, 42, msg || 'value must be the answer to life, the universe, and everything');
	};

	test('with a custom assertion', function (t) {
		t.ok(true, 'true is ok');
		t.assertion(isAnswer, 42);
		t.assertion(isAnswer, 42, 'what is 6 * 9?');
		t.assertion(isAnswer, 54, 'what is 6 * 9!');

		t.end();
	});
});
