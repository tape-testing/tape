'use strict';

var falafel = require('falafel');
var test = require('../');

test('nested array test', function (t) {
	t.plan(6);

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

	t.test('inside test', function (q) {
		q.plan(2);
		q.ok(true, 'inside ok');

		setTimeout(function () {
			q.ok(true, 'inside delayed');
		}, 3000);
	});

	var arrays = [
		[3, 4],
		[1, 2, [3, 4]],
		[5, 6],
		[[1, 2, [3, 4]], [5, 6]]
	];

	Function('fn', 'g', String(output))(
		/** @param {(number | number[])[]} xs */ function (xs) {
			t.same(arrays.shift(), xs);
			return xs;
		},
		/** @param {(number | number[])[]} xs */ function (xs) {
			t.same(xs, [[1, 2, [3, 4]], [5, 6]]);
		}
	);
});

test('another', function (t) {
	t.plan(1);
	setTimeout(function () {
		t.ok(true);
	}, 100);
});
