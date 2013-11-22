var through = require('through');
var duplexer = require('duplexer');
var split = require('split');

module.exports = function () {
    return duplexer(split(), through(write));
    
    function write (line) {
        console.log(line);
    }
};
