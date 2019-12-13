const path = require('path')
const glob = require('glob')
const pugIncludeGlob = require('pug-include-glob')
const magicImporter = require('node-sass-magic-importer')

// webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const pugHtmls = glob.sync('./src/*.pug').map(template => {
	const templateSplit = template.split('/')

	//output the filename to 2 directories above from output.path
	const filename = '../../' + templateSplit[templateSplit.length - 1].replace('.pug', '.html')

	return new HtmlWebpackPlugin({
		template,
		filename,
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
		filename: '[name].[hash].js',
		chunkFilename: '[name].[chunkhash].js',
		path: path.resolve(__dirname, 'tmp/www_shared/assets'), //this is the output path of the generated files
		publicPath: '/www_shared/assets/', //this is the public path (request path) to the folder that contains the generated files
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
						'@babel/plugin-proposal-optional-chaining',
						'@babel/plugin-proposal-nullish-coalescing-operator',
					],
				},
			},
			{
				test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot|wav|mp3)$/,
				loader: 'file-loader',
				options: {
					name: '[path][name].[ext]',
				},
			},
		],
	},
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: {
			name: 'manifest',
		},
		splitChunks: {
			// include all types of chunks
			chunks: 'all',
		},
		minimizer: [
			new UglifyJsPlugin({
				parallel: true,
			}),
		],
	},
	plugins: [
		...pugHtmls,<% if (replaceRazorLayout){ %>
		new HtmlWebpackPlugin({
			template: './cshtml/_Layout.cshtml',
			filename: '../../Views/Shared/Layout.cshtml', //the output path is relative to the output.path
			inject: false,
		}),<% } %>
		new CleanWebpackPlugin(),
		new SVGSpritemapPlugin('./src/icons/*.svg', {
			sprite: {
				prefix: () => '',
			},
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'main.[chunkhash].css',
		}),
		new ManifestPlugin(),
		new FileManagerPlugin({
			onStart: {
				// Remove file and folder
				delete: [<% if (replaceRazorLayout){ %>'../Views/Shared/Layout.cshtml', <% } %>'../www_shared/'],
			},
			onEnd: {
				copy: [
					// Copy all the files from tmp (except html) to '../'
					{ source: './tmp/**/*.!(html)', destination: '../' },
					{ source: './static/**/*', destination: '../www_shared/assets/' }
				],
			},
		}),
	],
	devServer: {
		compress: true,
		open: true,
		contentBase: path.resolve(__dirname, 'tmp/'), //serve static files from this path
		writeToDisk: true, //write build files to disk (to output.path)
	},
}
