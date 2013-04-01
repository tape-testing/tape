var createDefaultStream = require('./lib/default_stream');
var Render = require('./lib/render');
var Test = require('./lib/test');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function'
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;
var onexit = (function () {
    var stack = [];
    if (canEmitExit) process.on('exit', function (code) {
        for (var i = 0; i < stack.length; i++) stack[i](code);
    });
    return function (cb) { stack.push(cb) };
})();

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

var exitInterval;

function createHarness (conf_) {
    var pending = [];
    var running = false;
    var count = 0;
    
    var began = false;
    var only = false;
    var closed = false;
    var out = new Render();
    if (!conf_) conf_ = {};
    
    var tests = [];
    if (conf_.exit === false && exitInterval) clearInterval(exitInterval);
    
    exitInterval = !exitInterval && conf_.exit !== false && canEmitExit
    && typeof process._getActiveHandles === 'function'
    && setInterval(function () {
        if (process._getActiveHandles().length === 1) {
            tests.forEach(function (t) { t._exit() });
        }
    }, 200);
    
    var exitCode = 0;
    var exit = function (c) { exitCode = c };
    
    out.on('end', function () {
        nextTick(function () {
            clearInterval(exitInterval);
            if (canExit && conf_.exit !== false) process.exit(exitCode);
        });
    });
    
    var test = function (name, conf, cb) {
        count++;
        var t = new Test(name, conf, cb);
        tests.push(t);
        if (!conf || typeof conf !== 'object') conf = conf_;
        
        if (conf.exit !== false) {
            onexit(function (code) {
                t._exit();
                if (!closed) {
                    closed = true
                    out.close();
                }
                if (!code && !t._ok && (!only || name === only)) {
                    exit(1);
                }
            });
        }
        
        nextTick(function () {
            if (!out.piped) out.pipe(createDefaultStream());
            if (!began) out.begin();
            began = true;
            
            var run = function () {
                running = true;
                out.push(t);
                t.run();
            };
            
            if (only && name !== only) {
                count--;
                return;
            }

            if (running || pending.length) {
                pending.push(run);
            }
            else run();
        });
        
        t.on('test', function sub (st) {
            count++;
            st.on('test', sub);
            st.on('end', onend);
        });
        t.on('result', function (r) { if (!r.ok) exitCode = 1 });
        
        t.on('end', onend);
        
        return t;
        
        function onend () {
            count--;
            if (this._progeny.length) {
                var unshifts = map(this._progeny, function (st) {
                    return function () {
                        running = true;
                        out.push(st);
                        st.run();
                    };
                });
                pending.unshift.apply(pending, unshifts);
            }
            
            nextTick(function () {
                running = false;
                if (pending.length) return pending.shift()();
                if (count === 0 && !closed) {
                    closed = true
                    out.close();
                }
                if (conf.exit !== false && canExit && !t._ok) {
                    exit(1);
                }
            });
        }
    };
    
    test.only = function (name) {
        if (only) {
            throw new Error("there can only be one only test");
        }
        
        only = name;
        
        return test.apply(null, arguments);
    };
    
    test.stream = out;
    return test;
}

function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        res.push(f(xs[i]));
    }
    return res;
}

// vim: set softtabstop=4 shiftwidth=4:
