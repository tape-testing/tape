import tape from '../../index.js';

tape.test('mjs-h', function (t) {
	// @ts-expect-error
	t.ok(global.mjs_g, 'test ran after mjs-g');
	t.end();
});
