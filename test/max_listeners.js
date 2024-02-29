'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

var stripDeprecations = require('./common').stripDeprecations;

var ps = spawn(process.execPath, [path.join(__dirname, 'max_listeners', 'source.js')]);

ps.stdout.pipe(process.stdout, { end: false });

ps.stderr.on('data', /** @param {Buffer} buf */ function (buf) {
	if (stripDeprecations(buf)) {
		console.log('not ok ' + buf);
	}
});
