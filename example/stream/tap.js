var test = require('../../');
var path = require('path');
var fs = require('fs');
test.createStream().pipe(process.stdout);

process.argv.slice(2).forEach(function (file) {
    require(path.resolve(file));
});
