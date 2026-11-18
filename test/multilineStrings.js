'use strict';

var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

/** @type {(n: number, ex: string[], ac: string[]) => string[]} */
function failure(n, ex, ac) {
	return [
		'not ok ' + n + ' should be strictly equal',
		'  ---',
		'    operator: equal',
		'    expected: |-'
	].concat(ex.map(function (line) { return '      ' + line; }), '    actual: |-', ac.map(function (line) { return '      ' + line; }), [
		'    at: Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
		'    stack: |-',
		'      Error: should be strictly equal',
		'          [... stack stripped ...]',
		'          at Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
		'          [... stack stripped ...]',
		'  ...'
	]);
}

var summary = [
	'',
	'1..1',
	'# tests 1',
	'# pass  0',
	'# fail  1',
	''
];

tap.test('multilineStrings option: newlines in strings print as line breaks', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (body) {
		tt.same(stripFullStack(body), ['TAP version 13', '# multiline'].concat(
			failure(1, ['\'line one', 'line 2', 'line three\''], ['\'line one', 'line two', 'line three\'']),
			summary
		));
	}));

	test('multiline', { multilineStrings: true }, function (t) {
		t.equal('line one\nline two\nline three', 'line one\nline 2\nline three');
		t.end();
	});
});

tap.test('multilineStrings option: newlines are escaped by default', function (tt) {
	tt.plan(1);

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (body) {
		tt.same(stripFullStack(body), [
			'TAP version 13',
			'# escaped',
			'not ok 1 should be strictly equal',
			'  ---',
			'    operator: equal',
			'    expected: \'a\\nc\'',
			'    actual:   \'a\\nb\'',
			'    at: Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should be strictly equal',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...'
		].concat(summary));
	}));

	test('escaped', function (t) {
		t.equal('a\nb', 'a\nc');
		t.end();
	});
});

tap.test('NODE_TAPE_MULTILINE_STRINGS sets the default, and the option overrides it', function (tt) {
	tt.plan(1);

	var original = process.env.NODE_TAPE_MULTILINE_STRINGS;
	process.env.NODE_TAPE_MULTILINE_STRINGS = '1';
	tt.teardown(function () {
		if (typeof original === 'undefined') {
			delete process.env.NODE_TAPE_MULTILINE_STRINGS;
		} else {
			process.env.NODE_TAPE_MULTILINE_STRINGS = original;
		}
	});

	var test = tape.createHarness();
	test.createStream().pipe(concat({ encoding: 'string' }, function (body) {
		tt.same(stripFullStack(body), ['TAP version 13', '# from env'].concat(
			failure(1, ['\'a', 'c\''], ['\'a', 'b\'']),
			[
				'# opted out',
				'not ok 2 should be strictly equal',
				'  ---',
				'    operator: equal',
				'    expected: \'a\\nc\'',
				'    actual:   \'a\\nb\'',
				'    at: Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
				'    stack: |-',
				'      Error: should be strictly equal',
				'          [... stack stripped ...]',
				'          at Test.<anonymous> ($TEST/multilineStrings.js:$LINE:$COL)',
				'          [... stack stripped ...]',
				'  ...',
				'',
				'1..2',
				'# tests 2',
				'# pass  0',
				'# fail  2',
				''
			]
		), 'the env var turns it on; `multilineStrings: false` turns it back off');
	}));

	test('from env', function (t) {
		t.equal('a\nb', 'a\nc');
		t.end();
	});
	test('opted out', { multilineStrings: false }, function (t) {
		t.equal('a\nb', 'a\nc');
		t.end();
	});
});
