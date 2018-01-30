var test = require('../../');

test('default messages', function (t) {
  t.plan(11);
  t.ok(true);
  t.notOk(false);
  t.equal(true, true);
  t.notEqual(true, false);
  t.deepEqual(true, true);
  t.deepLooseEqual(true, true);
  t.notDeepLooseEqual(true, false);
  t.lessThan(1, 2);
  t.greaterThan(2, 1);
  t.lessThanOrEqual(1, 1);
  t.greaterThanOrEqual(1, 1);
});
