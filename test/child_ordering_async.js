var test = require('../');

test('parent', function (t) {
  var parentFinished = false;
  setTimeout(function () {
    t.pass('pass parent test');
    parentFinished = true;
    t.end();
  })

  t.test('child', function (t) {
    t.ok(parentFinished, 'parent should finish before child runs');
    t.end();
  })
})
