var tape = require('../..');

tape.only('only -n2 test 1 w/ only', function (t) {
    t.fail('not 1');
    t.end();
});

tape('only -n2 test 2 w/o only', function (t) {
    t.pass('yes 2');
    t.end();
});

tape('only -n2 test 3 w/o only', function (t) {
    t.fail('not 3');
    t.end();
});
