'use strict';

var tap = require('tap');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var hasDynamicImport = require('has-dynamic-import');
var assign = require('object.assign');

/** @param {string} args @param {Parameters<typeof spawn>[2]} [options] */
function tape(args, options) {
	var bin = __dirname + '/../bin/tape';

	var cp = spawn(process.execPath, [bin].concat(args.split(' ')), assign({ cwd: __dirname }, options));
	return /** @type {typeof cp & { stdout: NonNullable<typeof cp.stdout>; stderr: NonNullable<typeof cp.stderr> }} */ (cp);
}

tap.test('importing mjs files', function (t) {
	hasDynamicImport().then(function (hasSupport) {
		if (hasSupport) {
			var ps = tape('import/mjs-*.mjs');
			ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
				t.same(rows, [
					'TAP version 13',
					'# mjs-a',
					'ok 1 test ran',
					'# mjs-b',
					'ok 2 test ran after mjs-a',
					'# mjs-c',
					'ok 3 test ran after mjs-b',
					'# mjs-d',
					'ok 4 test ran after mjs-c',
					'# mjs-e',
					'ok 5 test ran after mjs-d',
					'# mjs-f',
					'ok 6 test ran after mjs-e',
					'# mjs-g',
					'ok 7 test ran after mjs-f',
					'# mjs-h',
					'ok 8 test ran after mjs-g',
					'',
					'1..8',
					'# tests 8',
					'# pass  8',
					'',
					'# ok'
				].join('\n') + '\n\n');
			}));
			ps.stderr.pipe(process.stderr);
			ps.on('exit', /** @param {number} code */ function (code) {
				t.equal(code, 0);
				t.end();
			});
		} else {
			t.pass('does not support dynamic import');
			t.end();
		}
	});
});

tap.test('importing type: "module" files', function (t) {
	hasDynamicImport().then(function (hasSupport) {
		if (hasSupport) {
			var ps = tape('import/package_type/*.js');
			ps.stdout.pipe(concat({ encoding: 'string' }, function (rows) {
				t.same(rows, [
					'TAP version 13',
					'# package-type-a',
					'ok 1 test ran',
					'# package-type-b',
					'ok 2 test ran after package-type-a',
					'# package-type-c',
					'ok 3 test ran after package-type-b',
					'',
					'1..3',
					'# tests 3',
					'# pass  3',
					'',
					'# ok'
				].join('\n') + '\n\n');
			}));
			ps.stderr.pipe(process.stderr);
			ps.on('exit', /** @param {number} code */ function (code) {
				t.equal(code, 0);
				t.end();
			});
		} else {
			t.pass('does not support dynamic import');
			t.end();
		}
	});
});

tap.test('errors importing test files', function (t) {
	hasDynamicImport().then(function (hasSupport) {
		var createTest = /** @param {(typeof tests)[number]} options */ function (options) {
			var message = options.error + ' in `' + options.mode + '` mode`';
			var ps = tape(options.files, { env: { NODE_OPTIONS: '--unhandled-rejections=' + options.mode } });
			ps.stderr.pipe(concat({ encoding: 'string' }, options.unhandledRejection(message)));
			ps.on('exit', /** @param {number} code */ function (code/* , sig */) {
				t.equal(code, options.exitCode, message + ' has exit code ' + options.exitCode);
			});
		};

		/** @param {string} message */
		var warning = function (message) {
			/** @param {Buffer} rows */
			return function (rows) {
				t.match(rows, 'UnhandledPromiseRejectionWarning', 'should have unhandled rejection warning: ' + message);
			};
		};

		/** @param {string} message */
		var noWarning = function (message) {
			/** @param {Buffer} rows */
			return function (rows) {
				t.notMatch(rows, 'UnhandledPromiseRejectionWarning', 'should not have unhandled rejection warning: ' + message);
			};
		};

		if (hasSupport) {
			var tests = [{
				files: 'import/syntax-error.mjs import/mjs-a.mjs import/mjs-b.mjs',
				error: 'syntax errors in first imported esm file',
				mode: 'warn',
				exitCode: 0,
				unhandledRejection: warning
			}, {
				files: 'import/throws.mjs import/mjs-a.mjs import/mjs-b.mjs',
				error: 'thrown errors in first imported esm file',
				mode: 'warn',
				exitCode: 0,
				unhandledRejection: warning
			}, {
				files: 'import/mjs-a.mjs import/syntax-error.mjs',
				error: 'syntax error in esm file',
				mode: 'warn',
				exitCode: 1,
				unhandledRejection: warning
			}, {
				files: 'import/syntax-error.mjs',
				error: 'syntax error in esm file',
				mode: 'strict',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/throws.mjs',
				error: 'thrown error in esm file',
				mode: 'strict',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/syntax-error.cjs',
				error: 'syntax error in cjs file',
				mode: 'warn',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/throws.cjs',
				error: 'thrown error in cjs file',
				mode: 'warn',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/syntax-error.cjs',
				error: 'syntax error in cjs file',
				mode: 'strict',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/throws.cjs',
				error: 'thrown error in cjs file',
				mode: 'strict',
				exitCode: 1,
				unhandledRejection: noWarning
			}, {
				files: 'import/mjs-a.mjs import/syntax-error.cjs',
				error: 'syntax error in cjs file in loading promise',
				mode: 'warn',
				exitCode: 1,
				unhandledRejection: warning
			}, {
				files: 'import/mjs-a.mjs import/syntax-error.cjs',
				error: 'syntax error in cjs file in loading promise',
				mode: 'strict',
				exitCode: 1,
				unhandledRejection: noWarning
			}];

			t.plan(tests.length * 2);

			tests.map(createTest);
		} else {
			t.pass('does not support dynamic import');
			t.end();
		}
	});
});
