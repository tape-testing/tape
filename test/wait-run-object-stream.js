'use strict';

var tap = require('tap');
var tape = require('../');

tap.test('Create stream then import async tests', function (t) {
    t.plan(3);

    var actualTests = function () {
        tape('This one should pass', function (t1) {
            t1.pass('This one should pass');
            t1.end();
        });
    };

    var simulateAsyncEsmImport = function () {
        return new Promise(function (resolve) {
            setTimeout(function () {
                actualTests();
                resolve();
            });
        });
    };

    tape.createStream({ objectMode: true }).on('data', function (res) {
        t.pass(res.type);
    });

    tape.wait();
    simulateAsyncEsmImport().then(function () {
        tape.run();
    });
});
