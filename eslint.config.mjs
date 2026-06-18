import ljharb from '@ljharb/eslint-config/flat';
import esm from '@ljharb/eslint-config/flat/esm';
import globals from 'globals';

export default [
	{
		ignores: ['**/syntax-error.*'],
	},
	...ljharb,
	{
		languageOptions: {
			ecmaVersion: 5,
			parserOptions: {
				allowReserved: false,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			'array-bracket-newline': 'off',
			'array-bracket-spacing': ['error', 'never'],
			complexity: 'off',
			'func-style': ['error', 'declaration'],
			'max-lines-per-function': 'off',
			'max-statements': 'warn',
			'max-statements-per-line': ['error', { max: 2 }],
			'multiline-comment-style': 'off',
			'no-extra-parens': 'off',
			'no-magic-numbers': 'off',
			'no-negated-condition': 'off',
			'no-underscore-dangle': 'warn',
			'object-curly-newline': 'off',
			'sort-keys': 'off',
		},
	},
	...esm.map((c) => ({
		...c,
		files: ['**/*.mjs', 'test/import/package_type/*.js'],
	})),
	{
		files: ['bin/[!.]*'],
		rules: {
			'global-require': 'off',
			'no-process-exit': 'off',
			'quote-props': ['error', 'as-needed', {
				keywords: false,
			}],
		},
	},
	{
		files: ['bin/import-or-require.js'],
		languageOptions: {
			ecmaVersion: 2020,
		},
	},
	{
		files: ['index.js'],
		rules: {
			'no-param-reassign': 'warn',
		},
	},
	{
		files: ['lib/results.js'],
		rules: {
			'no-cond-assign': 'warn',
			'no-param-reassign': 'warn',
			'no-plusplus': 'warn',
		},
	},
	{
		files: ['lib/test.js'],
		rules: {
			eqeqeq: 'warn',
			'func-name-matching': 'off',
			'max-params': 'off',
			'no-continue': 'off',
			'no-invalid-this': 'off',
			'no-multi-assign': 'off',
			'no-param-reassign': 'warn',
			'no-plusplus': 'warn',
			'no-restricted-syntax': 'off',
			'operator-linebreak': ['error', 'before'],
		},
	},
	{
		files: ['test/async-await/*'],
		languageOptions: {
			ecmaVersion: 2017,
		},
	},
	{
		files: ['example/**', 'test/**'],
		languageOptions: {
			globals: {
				g: false,
			},
		},
		rules: {
			'no-new-func': 'off',
		},
	},
	{
		files: ['example/**'],
		rules: {
			'array-bracket-newline': 'off',
			'global-require': 'off',
			'max-nested-callbacks': 'off',
			'no-console': 'off',
		},
	},
	{
		files: ['test/**'],
		rules: {
			'dot-notation': ['error', {
				allowKeywords: true,
				allowPattern: 'throws',
			}],
			'func-style': 'off',
			'id-length': 'off',
			'max-len': 'off',
			'max-lines-per-function': 'off',
			'no-plusplus': 'off',
			'no-throw-literal': 'off',
		},
	},
	{
		files: ['test/*/**'],
		rules: {
			camelcase: 'off',
		},
	},
	{
		files: ['lib/default_stream.js'],
		rules: {
			'no-use-before-define': 'warn',
		},
	},
	{
		files: ['lib/test.js'],
		rules: {
			'max-lines': 'off',
		},
	},
];
