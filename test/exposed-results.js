var tape = require('../');
var tap = require('tap');

tap.test('results object is exposed', function (assert) {

   assert.equal(typeof tape.results, 'function', 'tape.results is a function')

   assert.equal(tape.results().pass, 0)

   assert.end()

})

