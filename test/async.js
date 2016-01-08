var falafel = require('falafel');
var tape = require('../');
var tap = require('tap');
var trim = require('string.prototype.trim');

tap.test('async test calls', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    var tc = tap.createConsumer();

    test.createStream().pipe(tc);

    function run1(callback){
        test('first', function (t) {
            t.plan(1);

            t.pass();

            setTimeout(callback, 50);
        });
    }

    function run2(callback){
        test('second', function (t) {
            t.plan(1);

            t.pass();

            setTimeout(callback, 50);
        });
    }

    run1(function(){
        setTimeout(function(){
            run2(function(){
                tt.pass();
            });
        });
    });
});
