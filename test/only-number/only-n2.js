var tape = require('../..');

tape('only -n2 test 1', function (t) {
    t.fail('not 1');
    t.end();
});

tape('only -n2 test 2', function (t) {
    t.pass('yes 2');
    t.end();
});

tape('only -n2 test 3', function (t) {
    t.fail('not 3');
    t.end();
});
