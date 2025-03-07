'use strict';

var through = require('@ljharb/through');
var fs = require('fs');

var isObject = require('./isObject');

/** @type {import('./default_stream')} */
module.exports = function () {
	var line = '';
	var stream = through(write, flush);
	return stream;

	/** @param {unknown} buf */
	function write(buf) {
		if (
			buf == null // eslint-disable-line eqeqeq
			|| (!isObject(buf) && typeof buf !== 'string')
		) {
			flush();
			return;
		}
		if (typeof buf !== 'string' && (isObject(buf) && !('length' in buf))) {
			return;
		}
		for (var i = 0; i < Number(buf.length); i++) {
			var c = typeof buf === 'string'
				? buf.charAt(i)
				: String.fromCharCode(/** @type {ArrayLike<number>} */ (buf)[i]);
			if (c === '\n') {
				flush();
			} else {
				line += c;
			}
		}
	}

	function flush() {
		if (fs.writeSync && (/^win/).test(process.platform)) {
			try {
				fs.writeSync(1, line + '\n');
			} catch (e) {
				stream.emit('error', e);
			}
		} else {
			try {
				if (typeof console !== 'undefined' && console.log) { // eslint-disable-line no-console
					console.log(line); // eslint-disable-line no-console
				} else if (typeof document !== 'undefined') {
					// for IE < 9
					document.body.innerHTML += line + '<br />';
				}
			} catch (e) {
				stream.emit('error', e);
			}
		}
		line = '';
	}
};
