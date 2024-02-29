'use strict';

var tape = require('../..');

tape.test('test-a', function (t) {
	// @ts-expect-error
	t.ok(global.module_a, 'module-a loaded in same context');
	t.pass('test ran after module-a was loaded');
	t.end();
});
