'use strict';

var test = require('../../');
var falafel = require('falafel');

test('array', function (t) {
	t.plan(5);

	var src = '(' + function () {
		var xs = [1, 2, [3, 4]];
		var ys = [5, 6];
		// @ts-expect-error
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
		/** @param {number[]} xs */ function (xs) {
			t.same(arrays.shift(), xs);
			return xs;
		},
		/** @param {number[]} xs */ function (xs) {
			t.same(xs, [[1, 2, [3, 4444]], [5, 6]]);
		}
	);
});
