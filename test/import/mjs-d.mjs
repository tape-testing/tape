import tape from '../../index.js';

tape.test('mjs-d', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_c, 'test ran after mjs-c');
	t.end();
	// @ts-expect-error
	global.mjs_d = true;
});
