module.exports = {
	extends: [
		'react-app',
		'plugin:jsdoc/recommended',
		'plugin:prettier/recommended',
	],
	plugins: ['jsdoc', 'prettier', 'bem-classname'],
	rules: {
		'import/no-unresolved': 'error',
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'jsdoc/require-jsdoc': [
			'error',
			{
				require: {
					FunctionDeclaration: true,
					MethodDefinition: true,
					ClassDeclaration: true,
					ArrowFunctionExpression: true,
					FunctionExpression: true,
				},
			},
		],
		'jsdoc/require-param': 'error',
		'jsdoc/require-returns': 'error',
		'jsdoc/tag-lines': [
			'error',
			'any',
			{
				startLines: 1,
			},
		],
		'jsdoc/no-undefined-types': 'off',
		'jsdoc/check-line-alignment': [
			'error',
			'always',
			{
				tags: ['param'],
			},
		],
		'prettier/prettier': 'error',
		'bem-classname/bem': 'error',
	},
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx'],
			},
		},
	},
	overrides: [
		{
			files: ['*.js', '*.jsx'],
		},
	],
};
