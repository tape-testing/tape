import tape from '../../../index.js';

tape.test('package-type-a', function (t) {
	t.pass('test ran');
	t.end();
	// @ts-expect-error
	global.package_type_a = true;
});

