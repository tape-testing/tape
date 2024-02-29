'use strict';

var tape = require('../..');

tape.test('module-b', function (t) {
	t.plan(1);
	t.pass('loaded module b');
});

// @ts-expect-error
global.module_b = true;
