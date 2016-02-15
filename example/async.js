var test = require('../');

// These tests contain asynchronous functions, execute them in a specific sequence inside a Promise chain.
// The chain has to start with a Promise, which is an immediately invoked function expression here.
Promise.resolve((function () {
    // To make no mistake, immediately return a Promise for the next step in the chain.
    // Nested Promises are automatically flattened.
    // https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns
    return Promise.resolve(42)
        .then(function (context) {
            // These two tests share some context, and their order of execution is not important.
            // Return a Promise again, so the async test can be executed before the third test.
            return new Promise(function (resolve, reject) {
                test('first', function (t) {
                    setTimeout(function () {
                        t.equal(context, 42, 'first test');
                        t.end();
                        resolve();
                    }, 200);

                    test('second', function (t) {
                        t.equal(context, 42, 'second test');
                        t.end();
                    });
                });
            });
        });
} ()))
    .then(function () {
        // This test is always executed after the previous, because they are wrapped inside a Promise.
        // Since it is the last in the chain, we do not return a Promise.
        var context = 666;

        test('third', function (t) {
            setTimeout(function () {
                t.equal(context, 666, 'third test');
                t.end();
            }, 100);
        });
    });
