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

test.before((handle) => {
    print('before-1');
    spyBefore();
    handle.end();
});

test('Single test suite with nested tests. Before and After hooks added at suite level', (suite) => {
    suite.test('Nested test (1/2) from single test suite with nested tests. Startup and cleanup added at suite level', (t) => {
        t.equal(spyBefore.callCount, 1, 'Before hook was called once');
        t.equal(spyAfter.callCount, 0, 'After hook was not called');
        resetAllStartupSpies();
        t.end();
    });

    suite.test('Nested test (2/2) from single test suite with nested tests. Startup and cleanup added at suite level', (t) => {
        t.notOk(spyBefore.called, 'Parent Before hook should only be called before first nested child test');
        t.end();

        // Intentional asynchronous assert for cleanup hooks
        setTimeout(() => {
            t.equal(spyAfter.callCount, 1, 'After hook was called once after last child test case was executed');
        });
    });
});

test.after((handle) => {
    print('after-1');
    spyAfter();
    handle.end();
});



