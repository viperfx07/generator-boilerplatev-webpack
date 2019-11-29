const path = require('path')
const glob = require('glob')
const pugIncludeGlob = require('pug-include-glob')
const magicImporter = require('node-sass-magic-importer')

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')

const pugHtmls = glob.sync('./src/*.pug').map(template => {
	const templateSplit = template.split('/')

	return new HtmlWebpackPlugin({
		template,
		filename: templateSplit[templateSplit.length - 1].replace('.pug', '.html'),
	})
})

const getPostCssPlugins = () =>
	[
		require('autoprefixer')(),
		require('rucksack-css')({ reporter: true }),
		require('postcss-pxtorem')({ replace: false }),
		require('@fullhuman/postcss-purgecss')({
			content: ['./src/*.pug', './src/pug/**/*.pug', './src/js/*/**.vue'],
		}),
		require('cssnano')({
			rebase: false,
			// discardComments: {
			// 	removeAll: true,
			// },
			discardUnused: false,
			minifyFontValues: true,
			filterOptimiser: true,
			functionOptimiser: true,
			minifyParams: true,
			normalizeUrl: true,
			reduceBackgroundRepeat: true,
			convertValues: true,
			discardEmpty: true,
			minifySelectors: true,
			reduceInitial: true,
			reduceIdents: false,
			mergeRules: false,
			zindex: false,
		}),
	].filter(item => !!item)

module.exports = {
	entry: {
		main: ['./src/js/main.js', './src/css/main.scss'],
	},
	output: {
		filename: '[name].js?v=[hash]',
		chunkFilename: '[name].js?v=[chunkhash]',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
	},
	resolve: {
		extensions: ['.js', '.vue'],
		alias: {
			'@': path.resolve('src/js'),
			'@@': path.resolve('src'),
			// the ScrollMagic alias needed for debug indicators when running define(['ScrollMagic'], factory)
			ScrollMagic: 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
			TweenMax: 'gsap/umd/TweenMax.js',
			TweenLite: 'gsap/umd/TweenLite.js',
			TimelineMax: 'gsap/umd/TimelineMax.js',
		},
	},
	externals: {
		jquery: 'jQuery',
		vue: 'Vue',
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				oneOf: [
					{
						resourceQuery: /^\?vue/,
						use: ['pug-plain-loader'],
					},
					// this applies to pug imports inside JavaScript
					{
						use: [
							// 'raw-loader',
							{
								loader: 'pug-loader',
								options: {
									pretty: true,
									plugins: [pugIncludeGlob({})],
								},
							},
						],
					},
				],
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.scss$/,
				oneOf: [
					// this matches `<style module>`
					{
						resourceQuery: /module/,
						use: [
							'vue-style-loader',
							{
								loader: 'css-loader',
								options: {
									modules: true,
									localIdentName: '[path][name]---[local]---[hash:base64:5]',
									camelCase: true,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss-scss-module',
									plugins: () => getPostCssPlugins(),
								},
							},
							{
								loader: 'sass-loader',
								options: {
									sassOptions: {
										importer: magicImporter(),
									},
								},
							},
						],
					},
					// this matches plain `<style>` or `<style scoped>`
					{
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
								options: {},
							},
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss-scss',
									plugins: () => getPostCssPlugins(),
								},
							},
							{
								loader: 'sass-loader',
								options: {
									sassOptions: {
										importer: magicImporter(),
									},
								},
							},
						],
					},
				],
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules(\/|\\)(?!(conditioner-core|bootstrap|simplestatemanager)(\/|\\)).*/,
				options: {
					// note: if some modules don't work on IE10/IE11, try loose mode on preset-env
					// example below:
					// presets: [['@babel/preset-env', { loose: true }], '@babel/preset-react'],
					presets: ['@babel/preset-env'],
					plugins: [
						'@babel/plugin-transform-runtime',
						// // Stage 2
						// [
						// 	'@babel/plugin-proposal-decorators',
						// 	{ legacy: true }
						// ],
						// // Stage 3
						'@babel/plugin-syntax-dynamic-import',
						['@babel/plugin-proposal-class-properties', { loose: true }],
					],
				},
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|ttf|eot|wav|mp3)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
		],
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				parallel: true,
			}),
		],
		runtimeChunk: {
			name: 'manifest',
		},
		splitChunks: {
			// include all types of chunks
			chunks: 'all',
		},
	},
	plugins: [
		new SVGSpritemapPlugin('./src/icons/*.svg', {
			sprite: {
				prefix: () => '',
			},
		}),
		...pugHtmls,
		new HtmlWebpackPlugin({
			template: './cshtml/_Layout.cshtml',
			filename: './cshtml/Layout.cshtml',
			inject: false,
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'main.[chunkhash].css',
		}),
		new ManifestPlugin(),
	],
	devServer: {
		compress: true,
		open: true,
	},
}
