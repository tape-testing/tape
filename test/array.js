var falafel = require('falafel');
var tape = require('../');
var tap = require('tap');
var trim = require('string.prototype.trim');
var concat = require('concat-stream');

tap.test('array test', function (assert) {
    assert.plan(1);
    
    var test = tape.createHarness();
    
    test.createStream().pipe(concat(function (body) {

        var rs = body.toString('utf8').split('\n').map(function (r) {
            if (r && typeof r === 'object') {
                return { id : r.id, ok : r.ok, name : trim(r.name) };
            }
            else return r;
        });

        assert.same(rs, [
            'TAP version 13',
            '# array',
            'ok 1 should be equivalent',
            'ok 2 should be equivalent',
            'ok 3 should be equivalent',
            'ok 4 should be equivalent',
            'ok 5 should be equivalent',
            '',
            '1..5',
            '# tests 5',
            '# pass  5',
            '',
            '# ok',
            ''
        ]);
    }));
    
    test('array', function (t) {
        t.plan(5);
        
        var src = '(' + function () {
            var xs = [ 1, 2, [ 3, 4 ] ];
            var ys = [ 5, 6 ];
            g([ xs, ys ]);
        } + ')()';
        
        var output = falafel(src, function (node) {
            if (node.type === 'ArrayExpression') {
                node.update('fn(' + node.source() + ')');
            }
        });
        
        var arrays = [
            [ 3, 4 ],
            [ 1, 2, [ 3, 4 ] ],
            [ 5, 6 ],
            [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ],
        ];
        
        Function(['fn','g'], output)(
            function (xs) {
                t.same(arrays.shift(), xs);
                return xs;
            },
            function (xs) {
                t.same(xs, [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ]);
            }
        );
    });
});
