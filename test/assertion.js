'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');
var satisfies = require('semver').satisfies;

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
			typeof Promise === 'undefined'
				? '# SKIP custom assertion returns a promise'
				: [].concat(
					'# custom assertion returns a promise',
					'ok ' + ++count + ' promise rejected!',
					'not ok ' + ++count + ' SyntaxError: expected promise to reject; it fulfilled',
					'  ---',
					'    operator: error',
					'    stack: |-',
					'      SyntaxError: expected promise to reject; it fulfilled',
					'          at $TEST/assertion.js:$LINE:$COL',
					satisfies(process.version, '^8 || ^9')
						? '          at <anonymous>'
						: [],
					'          [... stack stripped ...]',
					'  ...'
				),
			'',
			'1..' + count,
			'# tests ' + count,
			'# pass  ' + (count - (typeof Promise === 'undefined' ? 1 : 2)),
			'# fail  ' + (typeof Promise === 'undefined' ? 1 : 2),
			''
		));
	}));

	var isAnswer = function (value, msg) {

		this.equal(value, 42, msg || 'value must be the answer to life, the universe, and everything');
	};

	test('with a custom assertion', function (t) {
		t.ok(true, 'true is ok');
		t.assertion(isAnswer, 42);
		t.assertion(isAnswer, 42, 'what is 6 * 9?');
		t.assertion(isAnswer, 54, 'what is 6 * 9!');

		t.end();
	});

	var rejects = function assertRejects(fn, expected, msg, extra) {
		var t = this;
		/* eslint no-invalid-this: 0 */
		return new Promise(function (resolve) { resolve(fn()); }).then(
			function () {
				throw new SyntaxError('expected promise to reject; it fulfilled');
			},
			function (err) {
				t['throws'](function () { throw err; }, expected, msg, extra);
			}
		);
	};

	test('custom assertion returns a promise', { skip: typeof Promise !== 'function' }, function (t) {
		return Promise.all([
			t.assertion(
				rejects,
				function () { return Promise.resolve(); },
				SyntaxError,
				'expected promise to reject; it fulfilled'
			),
			t.assertion(
				rejects,
				function () { return Promise.reject(new Error('foo')); },
				'promise rejected!'
			)
		]);
	});
});
