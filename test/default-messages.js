'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

tap.test('default messages', function (t) {
	t.plan(1);

	var ps = spawn(process.execPath, [path.join(__dirname, 'messages', 'defaults.js')]);

	ps.stdout.pipe(concat(function (rows) {
		t.same(stripFullStack(rows.toString('utf8')), [
			'TAP version 13',
			'# default messages',
			'ok 1 should be truthy',
			'ok 2 should be falsy',
			'ok 3 should be strictly equal',
			'ok 4 should not be strictly equal',
			'ok 5 should be loosely equal',
			'ok 6 should not be loosely equal',
			'ok 7 should be strictly equal',
			'ok 8 should not be strictly equal',
			'ok 9 should be deeply equivalent',
			'not ok 10 should not be deeply equivalent',
			'  ---',
			'    operator: notDeepEqual',
			'    expected: true',
			'    actual:   true',
			'    at: Test.<anonymous> ($TEST/messages/defaults.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: should not be deeply equivalent',
			'          [... stack stripped ...]',
			'          at Test.<anonymous> ($TEST/messages/defaults.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 11 should be loosely deeply equivalent',
			'ok 12 should not be loosely deeply equivalent',
			'',
			'1..12',
			'# tests 12',
			'# pass  11',
			'# fail  1',
			'',
			''
		]);
	}));
});
