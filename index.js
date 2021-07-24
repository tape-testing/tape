'use strict';

var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function';

module.exports = (function () {
    var wait = false;
    var harness;
    var lazyLoad = function () {
        // eslint-disable-next-line no-invalid-this
        return getHarness().apply(this, arguments);
    };

    lazyLoad.wait = function () {
        wait = true;
    };

    lazyLoad.run = function () {
        var run = getHarness().run;

        if (run) { run(); }
    };

    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };

    lazyLoad.createStream = function (opts) {
        var options = opts || {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: options.objectMode });
            return output;
        }
        return harness.createStream(options);
    };

    lazyLoad.onFinish = function () {
        return getHarness().onFinish.apply(this, arguments);
    };

    lazyLoad.onFailure = function () {
        return getHarness().onFailure.apply(this, arguments);
    };

    lazyLoad.getHarness = getHarness;

    return lazyLoad;

    function getHarness(opts) {
        if (!opts) { opts = {}; }
        opts.autoclose = !canEmitExit;
        if (!harness) { harness = createExitHarness(opts, wait); }
        return harness;
    }
}());

function createExitHarness(conf, wait) {
    var config = conf || {};
    var harness = createHarness({
        autoclose: defined(config.autoclose, false)
    });
    var running = false;
    var ended = false;

    if (wait) {
        harness.run = run;
    } else {
        run();
    }

    if (config.exit === false) { return harness; }
    if (!canEmitExit || !canExit) { return harness; }

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (typeof code === 'number' && code !== 0) {
            return;
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (!only || t === only) {
                    t._exit();
                }
            }
        }
        harness.close();

        process.removeAllListeners('exit'); // necessary for node v0.6
        process.exit(code || harness._exitCode); // eslint-disable-line no-process-exit
    });

    return harness;

    function run() {
        if (running) { return; }
        running = true;
        var stream = harness.createStream({ objectMode: config.objectMode });
        var es = stream.pipe(config.stream || createDefaultStream());
        if (canEmitExit) {
            // TODO: use `err` arg?
            // eslint-disable-next-line no-unused-vars
            es.on('error', function (err) { harness._exitCode = 1; });
        }
        stream.on('end', function () { ended = true; });
    }
}

module.exports.createHarness = createHarness;
module.exports.Test = Test;
module.exports.test = module.exports; // tap compat
module.exports.test.skip = Test.skip;

function createHarness(conf_) {
    var results = createResult();
    if (!conf_ || conf_.autoclose !== false) {
        results.once('done', function () { results.close(); });
    }

    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);

        (function inspectCode(st) {
            st.on('test', function sub(st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.todo && !r.ok && typeof r !== 'string') { test._exitCode = 1; }
            });
        }(t));

        results.push(t);
        return t;
    };
    test._results = results;

    test._tests = [];

    test.createStream = function (opts) {
        return results.createStream(opts);
    };

    test.onFinish = function (cb) {
        results.on('done', cb);
    };

    test.onFailure = function (cb) {
        results.on('fail', cb);
    };

    var only = false;
    test.only = function () {
        if (only) { throw new Error('there can only be one only test'); }
        only = true;
        var t = test.apply(null, arguments);
        results.only(t);
        return t;
    };
    test._exitCode = 0;

    test.close = function () { results.close(); };

    return test;
}
