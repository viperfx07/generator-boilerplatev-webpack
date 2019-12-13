# <%= projectName %> README

Generated on <%= (new Date).toISOString().split('T')[0] %> using
[<%= pkg.name %>@<%= pkg.version %>](https://github.com/viperfx07/generator-boilerplatev-webpack)

## Description

This is an example readme file.
Describe your site/app here.

## Technologies used

Build

-   [Webpack](http://webpack.js.org/) and [webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

JavaScript

-   [Babel](https://babeljs.io/)

Styles

-   [Sass](http://sass-lang.com/) via ([node-sass](https://github.com/sass/node-sass))

Markup

-   [Pug](http://pugjs.org/)

Optimization

-   [Uglify](https://github.com/mishoo/UglifyJS)
-   [PurgeCSS](https://github.com/FullHuman/postcss-purgecss) - Remove unused CSS.
-   [CSSNano](https://cssnano.co/) - Minify CSS.

Code Management

-   [Git](https://git-scm.com/)

## Automated tasks

This project uses [Webpack](http://webpack.js.org/) to run automated tasks for development and production builds.
The tasks are as follows:

-   `yarn dev`: initialize or do everyday development
-   `yarn build`: Builds and copies out **production** files through compilation of preprocessors and optimization of images to the destionation folder
-   `yarn build-develop`: Builds and copies **development** out files through compilation of preprocessors and optimization of images to the destionation folder (development mode)
-   `yarn d`: alias for `yarn dev`
-   `yarn b`: alias for `yarn build`
-   `yarn bd`: alias for `yarn build-develop`
