const path = require("path");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const pugIncludeGlob = require("pug-include-glob");
const magicImporter = require("node-sass-magic-importer");

const pugHtmls = glob.sync("./src/*.pug").map(template => {
  const templateSplit = template.split("/");

  return new HtmlWebpackPlugin({
    template,
    filename: templateSplit[templateSplit.length - 1].replace(".pug", ".html")
  });
});

const getPostCssPlugins = () =>
  [
    require("autoprefixer")(),
    require("rucksack-css")({ reporter: true }),
    require("postcss-pxtorem")({ replace: false }),
    require("cssnano")({
      rebase: false,
      discardComments: {
        removeAll: true
      },
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
      zindex: false
    })
  ].filter(item => !!item);

module.exports = {
	entry: () => {
		const entryArray = [
			...glob.sync('./src/js/*.js'),
			...glob.sync('./src/css/*.scss')
		]
		const entryObject = entryArray.reduce((acc, item) => {
			const name = path.basename(item).replace(/\.js$/gi, '')
			acc[name] = item
			return acc
		}, {})
		return entryObject
	},
	resolve: {
		alias: {
			'@': path.resolve('src/js'),
			'@@': path.resolve('src'),
			// the ScrollMagic alias needed for debug indicators when running define(['ScrollMagic'], factory)
			ScrollMagic: 'scrollmagic/scrollmagic/uncompressed/ScrollMagic.js',
			TweenMax: 'gsap/umd/TweenMax.js',
			TweenLite: 'gsap/umd/TweenLite.js',
			TimelineMax: 'gsap/umd/TimelineMax.js'
		}
	},
	externals: {
		jquery: 'jQuery',
		vue: 'Vue'
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader',
						query: {
							pretty: true,
							plugins: [pugIncludeGlob({})]
						}
					}
				]
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
									localIdentName:
										'[path][name]---[local]---[hash:base64:5]',
									camelCase: true
								}
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss-scss-module',
									plugins: () => getPostCssPlugins()
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sassOptions: {
										importer: magicImporter()
									}
								}
							}
						]
					},
					// this matches plain `<style>` or `<style scoped>`
					{
						use: [
							'vue-style-loader',
							'css-loader',
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss-scss',
									plugins: () => getPostCssPlugins()
								}
							},
							{
								loader: 'sass-loader',
								options: {
									sassOptions: {
										importer: magicImporter()
									}
								}
							}
						]
					}
				]
			}
		]
	},
	plugins: [...pugHtmls],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 9000
	}
}
