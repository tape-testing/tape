var util = require('util');
var http = require('http');

var test = require('../../');

test('async5', async function myTest(t) {
    try {
        t.ok(true, 'before server');

        var mockDb = { state: 'old' };
        var server = http.createServer(function (req, res) {
            res.end('OK');

            // Pretend we write to the DB and it takes time.
            setTimeout(function () {
                mockDb.state = 'new';
            }, 10);
        });

        await util.promisify(function (cb) {
            server.listen(0, cb);
        })();

        t.ok(true, 'after server');

        t.ok(true, 'before request');

        var res = await util.promisify(function (cb) {
            var req = http.request({
                hostname: 'localhost',
                port: server.address().port,
                path: '/',
                method: 'GET'
            }, function (res) {
                cb(null, res);
            });
            req.end();
        })();

        t.ok(true, 'after request');

        res.resume();
        t.equal(res.statusCode, 200);

        await new Promise(function (resolve, reject) {
            setTimeout(function () {
                t.equal(mockDb.state, 'new');

                server.close(function (err) {
                    if (err) { reject(err); }
                    else { resolve(); }
                });
            }, 50);
        });
    } catch (err) {
        t.ifError(err);
        t.end();
    }
});
