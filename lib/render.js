var Stream = require('stream');

module.exports = Render;

function Render () {
    Stream.call(this);
    this.readable = true;
    this.count = 0;
}

Render.prototype = new Stream;

Render.prototype.begin = function () {
    this.emit('data', 'TAP version 13\n');
};

Render.prototype.push = function (t) {
    var self = this;
    t.on('result', function (res) {
        self.emit('data', encodeResult(res, self.count + 1));
        self.count ++;
    });
};

Render.prototype.close = function () {
    this.emit('end');
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    return output;
}
