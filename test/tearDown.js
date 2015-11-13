var tap = require("tap");
var tape = require("../");

tap.test("tear down", {timeout: 1000}, function (tt) {
    tt.plan(1);
    tape.tearDown(function() {
        tt.pass('tape ended');
    });
    tape('dummy test', function(t) {
        t.end();
    });
});
