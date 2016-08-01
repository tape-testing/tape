var tape = require('../..');

tape('only -n test 1', function (t) {
    t.pass('yes 1');
    t.end();
});

tape('only -n test 2', function (t) {
    t.pass('yes 2');
    t.end();
});

tape('only -n test 3', function (t) {
    t.pass('yes 3');
    t.end();
});
