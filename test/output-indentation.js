var test = require('../');

test('Output indentation', function(t) {
  // Make some 3 level output.
  t.comment('LEVEL0');
  t.ok(true, 'LEVEL0');
  t.test('sync child B', function(tt) {
    tt.comment('LEVEL1');
    tt.ok(true, 'LEVEL1');
    setTimeout(function(){
      tt.test('async grandchild A', function(ttt) {
        ttt.comment('LEVEL2');
        ttt.ok(true, 'LEVEL2');
        ttt.end();
        tt.end();
        t.end();
      });
    }, 50);
  });

  // Do not do any testing while tests are still starting. t.ok() should happen afterwards.
  var tc = test.createStream(), rows = [];
  tc.on('data', function (r) {
    rows.push(r);
    if (r.indexOf('..') > 0) { // Test only after testing summary is printed.
      t.ok(rows.some(function (r) { return r === '#     sync child B\n'; }), 'level 1 indentation ok');
      t.ok(rows.some(function (r) { return r === '#         async grandchild A\n'; }), 'level 1 indentation ok');
    }
  });
});
