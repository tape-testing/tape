import tape from '../../index.js';

tape.test('mjs-e', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_d, 'test ran after mjs-d');
	t.end();
	// @ts-expect-error
	global.mjs_e = true;
});
