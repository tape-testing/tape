var through = require('through');
var combine = require('stream-combiner');
var split = require('split');

module.exports = function () {
    return combine(split(), through(write));
    
    function write (line) {
        console.log(line);
    }
};
