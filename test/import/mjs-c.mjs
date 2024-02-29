import tape from '../../index.js';

tape.test('mjs-c', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_b, 'test ran after mjs-b');
	t.end();
	// @ts-expect-error
	global.mjs_c = true;
});
