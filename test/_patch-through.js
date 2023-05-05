'use strict';

var Stream = require('stream');

if (Stream !== Stream.Stream) {
	var orig = require.extensions['.js'];

	require.extensions['.js'] = function (module, file) {
		if (file === require.resolve('through')) {
			var oldCompile = module._compile;
			module._compile = function (code, file) {
				module._compile = oldCompile;
				module._compile(code.replace(/^var Stream = require\('stream'\)\n/, 'var Stream = require(\'stream\').Stream;\n'), file);
			};
		}
		orig(module, file);
	};
	require('through');
}
