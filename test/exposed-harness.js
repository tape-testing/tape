'use strict';

var tape = require('../');
var tap = require('tap');

tap.test('main harness object is exposed', function (tt) {
	tt.equal(typeof tape.getHarness, 'function', 'tape.getHarness is a function');

	tt.equal(tape.getHarness()._results.pass, 0);

	tt.end();
});
