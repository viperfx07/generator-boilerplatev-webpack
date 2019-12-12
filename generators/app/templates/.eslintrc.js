module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: ['plugin:vue/recommended', 'prettier', 'prettier/vue', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	// add your custom rules here
	rules: {
		'no-console': 'off',
		camelcase: 'off',
		indent: ['error', 'tab'],
		'comma-dangle': ['off', 'always'],
	},
}
