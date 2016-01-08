var tape = require('../');
var tap = require('tap');

tap.test('async test calls', function (tt) {
    tt.plan(1);

    var test = tape.createHarness();
    var tc = tap.createConsumer();

    test.createStream({
        completeWait: function(callback){
            console.log('x');
            setTimeout(callback, 20);
        }
    }).pipe(tc);

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
