var Stream = require('stream');

module.exports = Render;

function Render () {
    Stream.call(this);
    this.readable = true;
}

Render.prototype = new Stream;

Render.prototype.push = function (t) {
    t.on('result', function (res) {
        console.dir(res);
    });
};

Render.prototype.close = function () {
    console.log('__END__');
};
