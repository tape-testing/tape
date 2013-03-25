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

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

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
    var exitInterval = conf_.exitInterval !== false && canEmitExit
    && typeof process._getActiveHandles === 'function'
    && setInterval(function () {
        if (process._getActiveHandles().length === 1) {
            tests.forEach(function (t) { t._exit() });
        }
    }, 200);
    
    var exitCode = 0;
    var exit = function (c) { exitCode = c };
    
    out.on('end', function () {
        clearInterval(exitInterval);
        process.exit(exitCode);
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
        
        process.nextTick(function () {
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
        
        t.on('end', onend);
        
        return t;
        
        function onend () {
            count--;
            if (this._progeny.length) {
                var unshifts = this._progeny.map(function (st) {
                    return function () {
                        running = true;
                        out.push(st);
                        st.run();
                    };
                });
                pending.unshift.apply(pending, unshifts);
            }
            
            process.nextTick(function () {
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

// vim: set softtabstop=4 shiftwidth=4:
