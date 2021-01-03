'use strict';

var test = require('../');

test('timing test', function (t) {
    t.plan(2);

    t.equal(typeof Date.now, 'function');
    var start = Date.now();

    setTimeout(function () {
        t.ok(Date.now() - start > 100);
    }, 100);
});
