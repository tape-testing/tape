'use strict';

var tap = require('tap');
var tape = require('../');

tap.test('on finish', { timeout: 1e3 }, function (tt) {
	tt.plan(1);
	tape.onFinish(function () {
		tt.pass('tape ended');
	});
	tape('dummy test', function (t) {
		t.comment('default harness comment');
		t.end();
	});
});

var tapeHarness = tape.createHarness();

tap.test('on finish (createHarness)', { timeout: 1e3 }, function (tt) {
	tt.plan(1);
	tapeHarness.onFinish(function () {
		tt.pass('tape ended');
	});
	tapeHarness('dummy test', function (t) {
		t.comment('createHarness comment');
		t.end();
	});
});
