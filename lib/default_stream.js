'use strict';

var through = require('@ljharb/through');
var fs = require('fs');

var isObject = require('es-object-atoms/isObject');

var $call = Function.prototype.call;

/** @type {typeof import('./default_stream')} */
module.exports = function () {
	var line = '';
	var stream = through(write, flush);

	/*
	 * capture `console` and `console.log` now, so that a later replacement
	 * (eg, `t.capture(console, 'log')`) does not swallow the TAP output
	 */
	var originalConsole = typeof console === 'undefined' ? void undefined : console;
	var originalLog = originalConsole && originalConsole.log;

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
				: String.fromCharCode(/** @type {ArrayLike<number>} */ (/** @type {unknown} */ (buf))[i]);
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
				if (originalLog) {
					$call.call(originalLog, originalConsole, line);
				} else if (typeof console !== 'undefined' && console.log) { // eslint-disable-line no-console
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
