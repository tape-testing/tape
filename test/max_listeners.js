var spawn = require('child_process').spawn;
var ps = spawn(process.execPath,
	[ require('path').join(__dirname, 'max_listeners', 'source.js') ]);
ps.stdout.pipe(process.stdout, { end : false });

ps.stderr.on('data', function (buf) {
    console.log('not ok ' + buf);
});
