var tap = require("tap");
var tape = require("../");
var concat = require('concat-stream');

tap.test("tape assert.end as callback", function (tt) {
    var test = tape.createHarness({ exit: false })
    
    test.createStream().pipe(concat(function (rows) {

        var rs = rows.toString('utf8').split('\n');
        // console.log(rs)
        tt.deepEqual(rs, [
            'TAP version 13',
            '# do a task and write',
            'ok 1 null',
            'ok 2 should be equal',
            '# do a task and write fail',
            'ok 3 null',
            'ok 4 should be equal',
            'not ok 5 Error: fail',
            getStackTrace(rs), // see: https://git.io/v6hGG
            '1..5',
            '# tests 5',
            '# pass  4',
            '# fail  1',
            ''
        ])

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

function getStackTrace (rows) {
    var stacktrace = '  ---"\n';
    var error = false;
    rows.forEach(function (row) {
        if (!error) {
            if (row.indexOf('---') > -1) {
                error = true; // the next line is first line of stack trace
            }
        } else {
            if (row.indexOf('...') > -1) { // the end of the stack trace
                error = false;
                stacktrace += '  "  ..."\n  "';
            } else {
                stacktrace += '  "' + row + '"\n';
            }

        }
    });
    // stacktrace += ' "\n';
    return stacktrace;
}
