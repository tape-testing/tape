var tape = require('../..');

tape('multi2 test 1', function (t) {
    t.fail('not 1');
    t.end();
});

tape('multi2 test 2', function (t) {
    t.pass('yes 2');
    t.end();
});

tape('multi2 test 3', function (t) {
    t.fail('not 3');
    t.end();
});
