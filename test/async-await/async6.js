'use strict';

const {EventEmitter} = require('events');
const test = require('../../');

test('async6: double end', async function myTest(t) {
    const events = new EventEmitter();

    events.once('change', () => {
        t.pass('good');
        t.end();
    });

    setTimeout(() => {
        events.emit('change');
    });
});
