var tap = require("tap");
var tape = require("../");
var concat = require('concat-stream');

tap.test("tape assert.end as callback", function (tt) {
    var test = tape.createHarness({ exit: false })
    
    test.createStream().pipe(concat(function (rows) {

        var rs = rows.toString('utf8');

        tt.equal(rs,
           'TAP version 13\n'
           + '# do a task and write\n'
           + 'ok 1 null\n'
           + 'ok 2 should be equal\n'
           + '# do a task and write fail\n'
           + 'ok 3 null\n'
           + 'ok 4 should be equal\n'
           + 'not ok 5 Error: fail\n'
           + getStackTrace(rs) // tap error stack
           + '\n'
           + '1..5\n'
           + '# tests 5\n'
           + '# pass  4\n'
           + '# fail  1\n'
        )
        tt.end()
    }));

    test("do a task and write", function (assert) {
        fakeAsyncTask("foo", function (err, value) {
            assert.ifError(err)
            assert.equal(value, "taskfoo")

            fakeAsyncWrite("bar", assert.end)
        })
    })

    test("do a task and write fail", function (assert) {
        fakeAsyncTask("bar", function (err, value) {
            assert.ifError(err)
            assert.equal(value, "taskbar")

            fakeAsyncWriteFail("baz", assert.end)
        })
    })
})

function fakeAsyncTask(name, cb) {
    cb(null, "task" + name)
}

function fakeAsyncWrite(name, cb) {
    cb(null)
}

function fakeAsyncWriteFail(name, cb) {
    cb(new Error("fail"))
}

/**
 * extract the stack trace for the failed test.
 * this will change dependent on the environment
 * so no point hard-coding it in the test assertion
 * see: https://git.io/v6hGG for example
 * @param String rows - the tap output lines
 * @returns String stacktrace - just the error stack part
 */
function getStackTrace(rows) {
    var stacktrace = '  ---\n';
    var extract = false;
    rows.split('\n').forEach(function (row) {
        if (!extract) {
            if (row.indexOf('---') > -1) { // start of stack trace
                extract = true;
            }
        } else {
            stacktrace += row + '\n';
            if (row.indexOf('...') > -1) { // end of stack trace
                extract = false;
            }

        }
    });
    return stacktrace;
}
