import tape from '../../index.js';

tape.test('mjs-g', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_f, 'test ran after mjs-f');
	t.end();
	// @ts-expect-error
	global.mjs_g = true;
});
