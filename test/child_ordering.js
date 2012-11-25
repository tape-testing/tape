var test = require('../');

var childRan = false;

test('parent', function(t) {
    t.test('child', function(t) {
        childRan = true;
        t.pass('child ran');
        t.end();
    });
    t.end();
});

test('uncle', function(t) {
    t.ok(childRan, 'Child should run before next top-level test');
    t.end();
});

// vim: set softtabstop=4 shiftwidth=4:
