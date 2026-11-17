'use strict';

var tape = require('../..');

tape('test', function (t) {
	// @ts-expect-error
	t.ok(global.importedSetup, 'the setup module was imported first, in the same context');
	t.end();
});
