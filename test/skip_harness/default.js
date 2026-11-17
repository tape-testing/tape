'use strict';

var skip = require('../../').skip;
var test = require('../../');

skip('skipped', function (t) {
	t.fail('should not run');
	t.end();
});

test('ran', function (t) {
	t.pass();
	t.end();
});
