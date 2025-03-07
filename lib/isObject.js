'use strict';

/** @type {(x: unknown) => x is object} */
module.exports = function isObject(x) {
	return Object(x) === x;
};
