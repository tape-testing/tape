'use strict';

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
            }, function (resp) {
                cb(null, resp);
            });
            req.end();
        })();

        t.ok(true, 'after request');

        res.resume();
        t.equal(res.statusCode, 200, 'res.statusCode is 200');

        setTimeout(function () {
            t.equal(mockDb.state, 'new', 'mockDb.state is new');

            server.close(function (err) {
                t.ifError(err, 'error on close');
                t.end();
            });
        }, 50);
    } catch (err) {
        t.ifError(err, 'error in catch');
        t.end();
    }
});
