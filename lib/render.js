var Stream = require('stream');

module.exports = Render;

function Render () {
    Stream.call(this);
    this.readable = true;
}

Render.prototype = new Stream;

Render.prototype.begin = function () {
    this.emit('data', 'TAP version 13\n');
};

Render.prototype.push = function (t) {
    t.on('result', function (res) {
        console.dir(res);
    });
};

Render.prototype.close = function () {
    console.log('__END__');
};
