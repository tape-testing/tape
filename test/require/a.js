'use strict';

var tape = require('../..');

tape.test('module-a', function (t) {
	t.plan(1);
	t.pass('loaded module a');
});

// @ts-expect-error
global.module_a = true;
