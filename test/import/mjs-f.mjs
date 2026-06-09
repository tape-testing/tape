import tape from '../../index.js';

tape.test('mjs-f', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_e, 'test ran after mjs-e');
	t.end();
	// @ts-expect-error
	global.mjs_f = true;
});
