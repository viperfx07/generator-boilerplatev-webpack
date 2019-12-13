const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		compress: true,
		open: true,
		contentBase: path.resolve(__dirname, 'tmp/'), //serve static files from this path
		writeToDisk: true, //write build files to disk (to output.path)
	},
})
