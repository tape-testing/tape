var test = require('../');

test('a simple test', function (t) {
    t.plan(2);
    
    t.equal(typeof Date.now, 'function');
    var start = Date.now();
    
    setTimeout(function () {
        t.equal(Date.now() - start, 100);
    }, 100);
});
