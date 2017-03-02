var tape = require('../');
var tap = require('tap');
var concat = require('concat-stream');

var stripFullStack = require('./common').stripFullStack;

function fn() {
    throw new TypeError('RegExp');
}

function getNonFunctionMessage(fn) {
    try {
        fn();
    } catch (e) {
        return e.message;
    }
}

var getter = function () { return 'message'; };
var messageGetterError = Object.defineProperty(
    { custom: 'error' },
    'message',
    { configurable: true, enumerable: true, get: getter }
);
var thrower = function () { throw messageGetterError; };

function exCustomError(message, name, code) {
  var fn = 'CustomError' //needs to be the same as function name
  var myerr = new Error(message)
  myerr.message = message ? message : ''
  myerr.name = name ? name : fn
  if (code) {
    myerr.code = code
    var code_pretty = typeof code === 'number' ? 'code:'+code+' ' : code+':'
    myerr.stack = myerr.stack.replace(myerr.name+':', myerr.name+': '+code_pretty)
  }
  myerr.stack = myerr.stack.replace(new RegExp("^\\s*at (new )?"+fn+".*$", 'm'), '')

  myerr.inspect = function () { // makes console.log(err) pretty
      return myerr.stack;
  };

  myerr.toString = function(){
    return myerr.stack
  }

  return myerr
}

tap.test('harmony only tests', function (tt) {
    var test = tape.createHarness();
    test.createStream().pipe(concat(function (body) {
        var out = body.toString('utf8')

        var numTests = /^#\stests\s+([0-9]+)/m.exec(out)
        numTests = numTests ? numTests[1] : 0
        var pass = /^#\spass\s+([0-9]+)/m.exec(out)
        pass = pass ? pass[1] : 0
        var fail = /^#\sfail\s+([0-9]+)/m.exec(out)
        fail = fail ? fail[1] : 0

        var msgs = out.match(/^((?:(?:not ok)|(?:ok))\s+[0-9]+.*$)/mg)
        tt.equal(fail, '2');
        tt.equal(pass, '7');

        tt.notEqual(msgs.indexOf('not ok 1 should throw'), -1);
        tt.notEqual(msgs.indexOf('not ok 2 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 3 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 4 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 5 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 6 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 7 should throw'), -1);
        tt.notEqual(msgs.indexOf('ok 8 should not throw'), -1);
        tt.notEqual(msgs.indexOf('ok 9 should not throw'), -1);

        tt.end()
    }));


  function syncboy(){
    throw new Error('a fit')
  }

  function asyncgirl() {
    return new Promise(function(resolve, reject){
      throw new Error('slugger'); //turns into promise rejection
      resolve() //never happens, rejection gets returned
    })
  }

  test('notice lack of sync throw',function(t) {
    t.throws( function(){}, /a fit/)
    t.end()
  })

  test('notice lack of async throw',function(t) {
    t.throws( async function(){}, /a fit/)
    t.end()
  })

  test('notice returned promise rejection', function(t){
    t.plan(1)
    t.throws( async function(){
      return Promise.reject(new Error('a fit'))
    }, /a fit/)
  })

  test('sync throw directly inside async',function(t) {
    t.plan(1)
    t.throws( async function(){
        throw new Error('slugger')
    }, /slugger/)
  })

  test('sync throw inside async function', function(t){
    t.plan(1)
    t.throws( async function(){
      syncboy()
    }, /a fit/)
  })

  test('returned reject in async func', function(t){
    t.plan(1)
    t.throws( async function(){
      return Promise.reject('a fit')
    }, /a fit/)
  })


  test('throw inside await async func', function(t){
    t.plan(1)
    t.throws( async function(){
      await asyncgirl()
    }, /slugger/)
  })

  test('doesNotThrow sync', function(t){
    t.plan(1)
    t.doesNotThrow( function(){} )
  })

  test('doesNotThrow async', function(t){
    t.plan(1)
    t.doesNotThrow( async function(){} )
  })
});
