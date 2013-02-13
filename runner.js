#!/usr/bin/env node
// `require` all files passed via command line so tests run in same process.
// use in your package.json like: "scripts": {"test": "tape mytests/*.js"}
// …or, if installed globally, like: `tape mytests/*.js`

var relative = require('path').relative;
process.argv.slice(2).map(function (file) {
    require('./' + relative(__dirname, file));
});
