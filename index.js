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
    
    return function (name, conf, cb) {
        if (typeof conf === 'function') {
            cb = conf;
            conf = {};
        }
        var t = new Test;
        t.name = name;
        
        process.nextTick(function () {
            if (!out.piped) out.pipe(createDefaultStream());
            if (!began) out.begin();
            began = true;
            
            var run = function () {
                running = true;
                out.push(t);
                cb(t);
            };
            
            if (running) {
                pending.push(run);
            }
            else run();
        });
        
        t.on('test', function (st) {
            pending.unshift(function () {
                running = true;
                out.push(st);
                st.run();
                
                st.on('end', onend);
            });
        });
        
        t.on('end', onend);
        
        function onend () {
            running = false;
            process.nextTick(function () {
                if (pending.length) pending.shift()()
                else out.close()
            });
        }
    };
    
    return out;
}
