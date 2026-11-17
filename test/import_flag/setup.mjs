import tape from '../../index.js';

tape('setup', function (t) {
	t.pass('imported the setup module');
	t.end();
});

// @ts-expect-error
globalThis.importedSetup = true;
