var createDefaultStream = require('./lib/default_stream');
var Render = require('./lib/render');
var Test = require('./lib/test');

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

function createHarness () {
    var pending = [];
    var running = false;
    
    var began = false;
    var out = new Render();
    
    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        
        process.nextTick(function () {
            if (!out.piped) out.pipe(createDefaultStream());
            if (!began) out.begin();
            began = true;
            
            var run = function () {
                running = true;
                out.push(t);
                t.run();
            };
            
            if (running || pending.length) {
                pending.push(run);
            }
            else run();
        });
        
        t.on('test', function sub (st) {
            st.on('test', sub);
            st.on('end', onend);
        });
        
        t.on('end', onend);
        
        return t
        
        function onend () {
            running = false;
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
                if (pending.length) pending.shift()()
                else out.close()
            });
        }
    };
    
    test.stream = out;
    return test;
}

// vim: set softtabstop=4 shiftwidth=4:
