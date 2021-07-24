'use strict';

var test = require('../../');

test('sync-error', function myTest(t) {
    t.ok(true, 'before throw');
    throw new Error('oopsie');
    /* eslint no-unreachable: 0 */
    t.ok(true, 'after throw');
    t.end();
});
