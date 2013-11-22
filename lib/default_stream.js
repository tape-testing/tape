var through = require('through');
var combine = require('stream-combiner');
var split = require('split');

module.exports = function () {
    var stream = combine(split(), through(write));
    return stream;
    
    function write (line) {
        try { console.log(line); }
        catch (e) { stream.emit('error', e) }
    }
};
