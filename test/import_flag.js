'use strict';

var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var hasDynamicImport = require('has-dynamic-import');

/** @param {string[]} args */
function tape(args) {
	var bin = __dirname + '/../bin/tape';

	var cp = spawn(process.execPath, [bin].concat(args), { cwd: __dirname });
	return /** @type {typeof cp & { stdout: NonNullable<typeof cp.stdout>; stderr: NonNullable<typeof cp.stderr> }} */ (cp);
}

var expected = [
	'TAP version 13',
	'# setup',
	'ok 1 imported the setup module',
	'# test',
	'ok 2 the setup module was imported first, in the same context',
	'',
	'1..2',
	'# tests 2',
	'# pass  2',
	'',
	'# ok',
	'',
	''
].join('\n');

tap.test('--import', function (t) {
	hasDynamicImport().then(function (hasSupport) {
		if (!hasSupport) {
			t.plan(2);
			var unsupported = tape(['--import', './import_flag/setup.mjs', 'import_flag/test.js']);
			unsupported.stderr.pipe(concat({ encoding: 'string' }, function (output) {
				t.match(output, /`--import` requires a version of node that supports dynamic `import\(\)`/);
			}));
			unsupported.on('exit', /** @param {number} code */ function (code) {
				t.equal(code, 1);
			});
			return;
		}

		t.plan(8);

		var bare = tape(['--import', 'import_flag/setup.mjs', 'import_flag/test.js']);
		bare.stderr.pipe(concat({ encoding: 'string' }, function (output) {
			t.match(output, /Cannot find module 'import_flag\/setup\.mjs'/, 'a path without `./` is a package name, as with `--require`');
		}));
		bare.on('exit', /** @param {number} code */ function (code) {
			t.notEqual(code, 0, 'a path without `./` fails');
		});

		[
			['--import', './import_flag/setup.mjs'],
			['--import=./import_flag/setup.mjs'],
			['--import', __dirname + '/import_flag/setup.mjs']
		].forEach(function (flags) {
			var ps = tape(flags.concat('import_flag/test.js'));
			ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
				t.same(rows, expected, flags.join(' '));
			}));
			ps.on('exit', /** @param {number} code */ function (code) {
				t.equal(code, 0, flags.join(' ') + ': exits 0');
			});
		});
	});
});

tap.test('--import and --require load in the order they are given', function (t) {
	hasDynamicImport().then(function (hasSupport) {
		if (!hasSupport) {
			t.end();
			return;
		}

		var expectedOrder = [
			'TAP version 13',
			'# required a',
			'ok 1 loaded first',
			'# imported b',
			'ok 2 loaded second',
			'# required c',
			'ok 3 loaded third',
			'',
			'1..3',
			'# tests 3',
			'# pass  3',
			'',
			'# ok',
			'',
			''
		].join('\n');

		var orders = [
			['-r', './import_flag/order-a.js', '--import', './import_flag/order-b.mjs', '-r', './import_flag/order-c.js'],
			['--require=./import_flag/order-a.js', '--import=./import_flag/order-b.mjs', '--require=./import_flag/order-c.js']
		];
		t.plan(orders.length * 2);

		orders.forEach(function (flags) {
			var ps = tape(flags);
			ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
				t.same(rows, expectedOrder, flags.join(' '));
			}));
			ps.on('exit', /** @param {number} code */ function (code) {
				t.equal(code, 0, flags.join(' ') + ': exits 0');
			});
		});
	});
});
