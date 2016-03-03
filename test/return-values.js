var test = require('../');

// fail
test('pass always returns true', makeTest('pass', [false]));
test('ok returns true if true', makeTest('ok', [true]));
test('notOk returns true if false', makeTest('notOk', [false]));
test('error returns true if error', makeTest('error', [false]));
test('equals returns true for the same values', makeTest('equal', [1, 1]));
test('not returns true for different values', makeTest('notEqual', [1, 2]));
test('deepEqual returns true when equivalent', makeTest('deepEqual', [{}, {}]));
test('deepLooseEqual returns true when deep equal', makeTest('looseEqual', [{}, {}]));
test('notDeepEqual returns true when not the same', makeTest('notDeepEqual', [{}, [1]]));
test('notLooseEqual returns true when not deep equal', makeTest('notDeepLooseEqual', [{}, [1]]));
test('throws returns true if the function throws', makeTest('throws', [function() { throw new Error(); }, Error]));
test('doesNotThrow returns true if the function does not throw', makeTest('doesNotThrow', [function() {}, null]));

function makeTest(f, args) {
  return function (t) {
    t.equal(t[f].apply(t, args), true);
    t.end();
  }
}
