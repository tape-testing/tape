'use strict';

function setUp() {
	// ... example ...
}

function tearDown() {
	// ... example ...
}

// Example of wrapper function that would invoke tape
/** @type {(this: import('../../lib/test') | void, testCase: import('../../lib/test').TestCase) => import('../../lib/test').TestCase} */
module.exports = function (testCase) {
	return function (t) {
		setUp();
		testCase(t);
		tearDown();
	};
};
