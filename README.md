# better-tape
better-tape is intended to be an extension pack with some of the much requested features that are missing in tape. Here is
a 10 minute [read](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4) on why 
one should pick `tape` over `mocha`.

Following are the features that are currently supported
- Support for `before(handle)` to provide start-up hook
- Support for `after(handle)` to provide clean-up hook
- **Full support for adding the above hooks at all levels of a nested test suite**

## Install
```
npm i better-tape --save-dev
```

## Example
Using `before` and `after` hooks at top level
```
const test = require('../');

test.before((handle) => {
    console.log(`\n>> INSIDE before`);
    handle.end();
});

test.after((handle) => {
    console.log(`>> INSIDE after\n`);
    handle.end();
});

test('Test 1', (t) => {
    t.pass('Executing Test 1');
    t.end();
});

test('Test 2', (t) => {
    t.pass('Executing Test 2');
    t.end();
});
```
Output
```
TAP version 13
# Subtest: test/sample.js
    # Test 1

    >> INSIDE before
    ok 1 Executing Test 1
    >> INSIDE after

    # Test 2

    >> INSIDE before
    ok 2 Executing Test 2
    >> INSIDE after

    1..2
    # tests 2
    # pass  2

    # ok

ok 1 - test/sample.js # time=109.678ms

1..1
# time=122.405ms
```

Using `before` and `after` hooks with nested test cases
```
const test = require('../');

test.before((handle) => {
    console.log(`\n>> INSIDE before`);
    handle.end();
});

test.after((handle) => {
    console.log(`>> INSIDE after\n`);
    handle.end();
});

test('Suite 1', (suite) => {
    suite.before((handle) => {
        console.log(`\n\t >>>> INSIDE NESTED before`);
        handle.end();
    });

    suite.after((handle) => {
        console.log(`\t >>>> INSIDE NESTED after\n`);
        handle.end();
    });

    suite.test('Nested test 1', (t) => {
        t.pass('Executing Nested Test 1');
        t.end();
    });

    suite.test('Nested test 2', (t) => {
        t.pass('Executing Nested Test 2');
        t.end();
    });
});
```
Output
```
TAP version 13
# Subtest: test/sample.js
    # Suite 1

    >> INSIDE before
    # Nested test 1

    	 >>>> INSIDE NESTED before
    ok 1 Executing Nested Test 1
    	 >>>> INSIDE NESTED after

    # Nested test 2

    	 >>>> INSIDE NESTED before
    ok 2 Executing Nested Test 2
    	 >>>> INSIDE NESTED after

    >> INSIDE after

    1..2
    # tests 2
    # pass  2

    # ok

ok 1 - test/sample.js # time=102.496ms

1..1
# time=115.107ms
```

## Usage
Please refer to official `tape` [documentation](https://github.com/substack/tape) for complete usage information

### LICENCE
Copyright of large portions of project better-tape are held by James Halliday as part of project [tape](https://github.com/substack/tape).
All other copyright for project is under MIT license.