'use strict';

const { isAbsolute } = require('path');
const { pathToFileURL } = require('url');

/** @type {(file: string) => Promise<unknown>} */
module.exports = function importModule(file) {
	// `resolve` returns a path for a file, and the bare name for a core module
	return import(isAbsolute(file) ? pathToFileURL(file).href : file);
};
