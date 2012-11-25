var createDefaultStream = require('./lib/default_stream');
var Render = require('./lib/render');
var Test = require('./lib/test');

exports = module.exports = createHarness();
exports.createHarness = createHarness;
exports.Test = Test;

function createHarness () {
    var pending = [];
    var running = false;
    var out = new Render();
    
    return function (name, conf, cb) {
        if (typeof conf === 'function') {
            cb = conf;
            conf = {};
        }
        var t = new Test;
        out.push(t);
        
        var piped = false;
        
        t.pipe = function () {
            piped = true;
        };
        
        t.once('pipe', function () {
            piped = true;
        });
        
        process.nextTick(function () {
            if (!piped) out.pipe(createDefaultStream());
            
            var run = function () {
                running = true;
                cb(t);
            };
            
            if (running) {
                pending.push(run);
            }
            else run();
        });
        
        t.on('end', function () {
            running = false;
            process.nextTick(function () {
                if (pending.length) pending.shift()()
                else out.close()
            });
        });
    };
    
    return out;
}
