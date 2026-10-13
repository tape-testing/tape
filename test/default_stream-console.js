'use strict';

var tap = require('tap');
var mockProperty = require('mock-property');

var getDefaultStream = require('../lib/default_stream');

var isWindows = (/^win/).test(process.platform);
var consoleDescriptor = Object.getOwnPropertyDescriptor(global, 'console');

tap.test('default stream: falls back to `console.log` at write time', { skip: isWindows && 'windows writes to fd 1 directly' }, function (tt) {
	tt.test('when `console.log` was missing at creation', function (st) {
		/** @type {unknown[]} */
		var lines = [];

		var restoreMissing = mockProperty(console, 'log', { value: undefined });
		var stream = getDefaultStream();
		restoreMissing();

		var restoreRecorder = mockProperty(console, 'log', { value: /** @param {unknown} line */ function (line) { lines.push(line); } });
		stream.write('a\n');
		restoreRecorder();

		st.same(lines, ['a'], 'the current `console.log` receives the output');
		st.end();
	});

	tt.test('when `console` was missing at creation', { skip: !consoleDescriptor || !consoleDescriptor.configurable }, function (st) {
		/** @type {unknown[]} */
		var lines = [];

		var restoreMissing = mockProperty(global, 'console', { 'delete': true });
		var stream = getDefaultStream();
		restoreMissing();

		var restoreRecorder = mockProperty(console, 'log', { value: /** @param {unknown} line */ function (line) { lines.push(line); } });
		stream.write('b\n');
		restoreRecorder();

		st.same(lines, ['b'], 'the current `console.log` receives the output');
		st.end();
	});

	tt.end();
});
