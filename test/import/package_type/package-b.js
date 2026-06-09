import tape from '../../../index.js';

tape.test('package-type-b', function (t) {
	// @ts-expect-error
	t.ok(global.package_type_a, 'test ran after package-type-a');
	t.end();
	// @ts-expect-error
	global.package_type_b = true;
});
