var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

tap.test('async test calls', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();

    test.createStream().pipe(concat(function(){})); // Ignore output

    function run1(callback){
        test('first', function (t) {
            t.plan(1);

            t.pass();

            setTimeout(callback, 10);
        });
    }

    function run2(callback){
        test('second', function (t) {
            t.plan(1);

            t.pass();

            setTimeout(callback, 10);
        });
    }

    run1(function(){
        run2(function(){
            tt.pass();
        });
    });
});
