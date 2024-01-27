'use strict';

var tap = require('tap');

var getDefaultStream = require('../lib/default_stream');

tap.test('getDefaultStream', function (tt) {
	tt.plan(5);

	var stream = getDefaultStream();

	tt.doesNotThrow(function () { stream.write('# ok'); }, 'strings are fine');
	tt.doesNotThrow(function () { stream.write(123); }, 'numbers are fine');
	tt.doesNotThrow(function () { stream.write(undefined); }, 'undefined is fine');
	tt.doesNotThrow(function () { stream.write(); }, 'no args is fine');
	tt.doesNotThrow(function () { stream.write(null); }, 'null is fine');
	// TODO: figure out why writing to the stream after writing null fails tests

	tt.end();
});
