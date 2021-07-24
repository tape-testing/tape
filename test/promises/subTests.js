'use strict';

var test = require('../../');

if (typeof Promise === 'function' && typeof Promise.resolve === 'function') {
    test('promise', function (t) {
        t.test('sub test that should fail', function () {
            return new Promise(function (resolve, reject) {
                reject(new Error('rejection message'));
            });
        });
        t.test('sub test that should pass', function (st) {
            st.plan(1);
            st.ok(true);
        });
    });
} else {
    // if promises aren't supported pass the node-tap test
    console.log('skip');
}
