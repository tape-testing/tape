var createDefaultStream = require('./lib/default_stream');
var Render = require('./lib/render');
var Test = require('./lib/test');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function'
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

var exitInterval;

function createHarness (conf_) {
    var count = 0;
    var exitCode = 0;
    var output = through(null, function () {
        if (--count === 0 && !closed) {
            closed = true
            out.close();
        }
    });
    output.pause();
    nextTick(function () { output.resume() });
    
    var test = function (name, conf, cb) {
        count++;
        var t = new Test(name, conf, cb);
        t.on('test', function sub (st) {
            console.log('SUBTEST');
        });
        t.on('result', function (r) {
            console.dir(r);
            if (!r.ok) exitCode = 1
        });
        nextTick(function () {
            t.run();
        });
        return t;
    };
    
    return test;
}
