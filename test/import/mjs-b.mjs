import tape from '../../index.js';

tape.test('mjs-b', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_a, 'test ran after mjs-a');
	t.end();
	// @ts-expect-error
	global.mjs_b = true;
});
