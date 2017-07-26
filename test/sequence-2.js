const sinon = require('sinon');
const test = require('../index');

const startupSpies = [];
const cleanupSpies = [];

const enablePrint = false;
function print(val) {
    if (enablePrint) {
        console.log(`     *******************************  ${val}  *******************************`);
    }
}

const spyBefore = provisionStartupSpy();
const spyAfter = provisionCleanupSpy();

function provisionStartupSpy() {
    const spy = sinon.stub();
    startupSpies.push(spy);
    return spy;
}

function provisionCleanupSpy() {
    const spy = sinon.stub();
    cleanupSpies.push(spy);
    return spy;
}

function resetAllStartupSpies() {
    for (const spy of startupSpies) {
        spy.reset();
    }
}

function resetAllCleanupSpies() {
    for (const spy of cleanupSpies) {
        spy.reset();
    }
}

test.before((handle) => {
    print('before-1');
    spyBefore();
    handle.end();
});

test.after((handle) => {
    print('after-1');
    spyAfter();
    handle.end();
});

test('Test (1/2) with before and after hook run in order', (t) => {
    t.equal(spyBefore.callCount, 1, 'Before hook was called once');
    resetAllStartupSpies();
    t.end();
});

test('Test (2/2) with couple of startup and cleanup run in order', (t) => {
    // Assert clean-ups for previous test case
    t.equal(spyAfter.callCount, 1, 'After hook was called once');
    resetAllCleanupSpies();

    t.equal(spyBefore.callCount, 1, 'Before hook was called once');
    resetAllStartupSpies();

    t.end();

    // Intentional asynchronous assert for cleanup hooks
    setTimeout(() => {
        t.equal(spyAfter.callCount, 1, 'After hook was called once');
    });
});

