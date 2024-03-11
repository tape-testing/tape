'use strict';

var tape = require('../');
var tap = require('tap');

tap.test('tape.wait()', function (tt) {
	tt.equal(typeof tape.getHarness, 'function', 'tape.getHarness is a function');

	tt.equal(typeof tape.run, 'function', 'tape.run is a function');

	tape.wait();

	tt.equal(typeof tape.getHarness().run, 'function', 'tape.getHarness().run is a function (wait called)');

	tt.end();
});
