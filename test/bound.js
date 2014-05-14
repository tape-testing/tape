var test = require('../');

test('bind works', function (t) {
  [
    [t.equal, 3, 3],
    [t.deepEqual, [4], [4]],
  ].forEach(function(testCase) {
    var func = testCase[0];
    func.apply(null, testCase.slice(1));
  });
  t.end();
});
