var test = require('../../');
var path = require('path');
var fs = require('fs');
test.createStream({ objectMode: true }).on('data', function (row) {
    console.log(JSON.stringify(row))
});

process.argv.slice(2).forEach(function (file) {
    require(path.resolve(file));
});
