'use strict';

var falafel = require('falafel');
var test = require('../');

test('array', function (t) {
	t.plan(3);

	var src = '(' + function () {
		var xs = [1, 2, [3, 4]];
		var ys = [5, 6];
		g([xs, ys]);
	} + ')()';

	var output = falafel(src, function (node) {
		if (node.type === 'ArrayExpression') {
			node.update('fn(' + node.source() + ')');
		}
	});

	var arrays = [
		[3, 4],
		[1, 2, [3, 4]],
		[5, 6],
		[[1, 2, [3, 4]], [5, 6]]
	];

	Function('fn', 'g', String(output))(
		function (xs) {
			t.same(arrays.shift(), xs);
			return xs;
		},
		function (xs) {
			t.same(xs, [[1, 2, [3, 4]], [5, 6]]);
		}
	);
});
