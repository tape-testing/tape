#!/usr/bin/env node
// `require` all files passed via command line so tests run in same process
// use in your package.json like:
//   "scripts": {"test": "./node_modules/.bin/taper mytests/*.js"}
//
// …or, if installed globally, or if ./node_modules/.bin is in your $PATH,
// from the command line like:
//    `taper mytests/*.js`

var relative = require('path').relative;
process.argv.slice(2).map(function (file) {
    require('./' + relative(__dirname, file));
});
