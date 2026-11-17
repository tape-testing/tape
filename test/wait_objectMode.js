'use strict';

var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var path = require('path');

tap.test('an objectMode stream created after `tape.wait()` sees the tests queued before `tape.run()`', function (tt) {
	tt.plan(2);

	var ps = spawn(process.execPath, [path.join(__dirname, 'wait', 'objectMode.js')]);
	ps.stdout.pipe(concat({ encoding: 'string' }, function (output) {
		var rows = JSON.parse(output);
		tt.same(rows.map(/** @param {{ type: string, test?: number, ok?: boolean }} row */ function (row) {
			return row.type === 'assert'
				? { type: row.type, test: row.test, ok: row.ok }
				: row;
		}), [
			{ type: 'test', name: 'queued before run', id: 0, skip: false, todo: false },
			{ type: 'assert', test: 0, ok: true },
			{ type: 'end', test: 0 },
			{ type: 'test', name: 'queued later', id: 1, skip: false, todo: false },
			{ type: 'test', name: 'subtest', id: 2, skip: false, todo: false, parent: 1 },
			{ type: 'assert', test: 2, ok: true },
			{ type: 'end', test: 2 },
			{ type: 'end', test: 1 }
		]);
	}));
	ps.on('exit', /** @param {number} code */ function (code) {
		tt.equal(code, 0);
	});
});
