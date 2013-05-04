var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResultStream = require('./lib/results');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function'
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = (function () {
    var harness;
    return function () {
        if (!harness) {
            harness = createHarness();
            var stream = harness.createStream();
            stream.pipe(createDefaultStream());
            
            var ended = false;
            stream.on('end', function () { ended = true });
            
            if (process.exit && process._getActiveHandles) {
                var iv = setInterval(function () {
                    if (process._getActiveHandles().length > 1) return;
                    
                    clearInterval(iv);
                    setTimeout(function () {
                        if (!ended) {
                            for (var i = 0; i < harness._tests.length; i++) {
                                var t = harness._tests[i];
                                t._exit();
                            }
                        }
                        process.exit(harness._exitCode);
                    }, 100);
                });
            }
        }
        return harness.apply(this, arguments);
    };
})();

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat

var exitInterval;

function createHarness (conf_) {
    var results;
    
    var test = function (name, conf, cb) {
        if (!results) {
            results = createResultStream();
            results.pause();
        }
        
        var t = new Test(name, conf, cb);
        test._tests.push(t);
        
        (function inspectCode (st) {
            st.on('test', function sub (st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok) test._exitCode = 1
            });
        })(t);
        
        results.push(t);
        return t;
    };
    
    test._tests = [];
    
    test.createStream = function () {
        if (!results) results = createResultStream();
        nextTick(function () { results.resume() });
        return results;
    };
    
    var only = false;
    test.only = function (name) {
        if (only) throw new Error('there can only be one only test');
        results.only(name);
        only = true;
        return test.apply(null, arguments);
    };
    test._exitCode = 0;
    
    return test;
}
