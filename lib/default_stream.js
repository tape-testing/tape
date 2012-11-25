var Stream = require('stream');

module.exports = function () {
    if (typeof process !== 'undefined' && process.stdout
    && typeof process.stdout.pipe === 'function') {
        return process.stdout;
    }
    
    var out = new Stream;
    out.writable = true;
    
    out.write = function (buf) {
        console.log(String(buf));
    };
    
    out.destroy = function () {
        out.emit('close');
    };
    
    out.end = function () {
        out.emit('close');
    };
    
    return out;
};
