import tape from '../../index.js';

tape.test('mjs-a', function (t) {
	t.pass('test ran');
	t.end();
	// @ts-expect-error
	global.mjs_a = true;
});

