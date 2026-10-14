'use strict';

var tap = require('tap');
var path = require('path');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

// node 0.10 names the anonymous test callback after a variable declared later in the fixture
var callbackName = (/^0\.10\./).test(process.versions.node) ? 'original' : '<anonymous>';

tap.test('capturing `console` methods does not capture TAP output', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'capture-output', 'console.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
		tt.same(stripFullStack(rows), [
			'TAP version 13',
			'# capturing console methods',
			'ok 1 before capturing',
			'ok 2 while capturing',
			'not ok 3 failure while capturing',
			'  ---',
			'    operator: fail',
			'    at: Test.' + callbackName + ' ($TEST/capture-output/console.js:$LINE:$COL)',
			'    stack: |-',
			'      Error: failure while capturing',
			'          [... stack stripped ...]',
			'          at Test.' + callbackName + ' ($TEST/capture-output/console.js:$LINE:$COL)',
			'          [... stack stripped ...]',
			'  ...',
			'ok 4 user output is captured',
			'ok 5 user output is captured',
			'ok 6 after restoring',
			'# replacing console.log directly',
			'ok 7 while replaced',
			'ok 8 only user output reaches the replacement',
			'',
			'1..8',
			'# tests 8',
			'# pass  7',
			'# fail  1',
			'',
			''
		]);
	}));

	ps.on('exit', /** @param {number} code */ function (code) {
		tt.equal(code, 1);
	});
});
