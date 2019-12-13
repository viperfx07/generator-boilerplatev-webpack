# BoilerplateV Generator (Webpack only version) [![npm version](https://badge.fury.io/js/generator-boilerplatev-webpack.svg)](https://badge.fury.io/js/generator-boilerplatev-webpack)

A generator based on [generator-boilerplatev](https://github.com/viperfx07/generator-boilerplatev). This version removes Gulp completely and only uses Webpack. The benefits:

-   All configuration is maintained in webpack
-   Faster download and build time due to fewer dependencies

# Table of Contents

-   [Requirements](#requirements)
-   [Getting Started](#getting-started)
-   [HTML](#html)
-   [CSS](#css)
-   [Javascript](#javascript)
-   [Issues / Todo](#issues-todo)

# Requirements

1. Node >= v10.x (Latest LTS is recommended)
2. Yarn (alternative of npm but faster, so it's recommended to use)

# Getting Started

This generator utilizes [Yeoman](http://yeoman.io/) and [Webpack](https://webpack.js.org/) to scaffold out projects, automate tasks, and manage front-end dependencies respectively. If this is your first time here, it is recommended you [read about these tools](http://yeoman.io/learning/index.html) before proceeding.

## Installation

### Node.js

Check to see if you already have Node installed. Do this by bringing up a terminal/command prompt and type `node -v`. If the response shows a version at or above `v10.x`, you are all set and can proceed to installing Yeoman. If you see an error and/or your version is too low, navigate to the [Node.js](http://nodejs.org/) website and install Node from there.

### Yeoman

Once you have Node installed, make sure you have these tools by opening up a terminal/command prompt and entering following commands:

| Command        |       Response       |
| -------------- | :------------------: |
| `yo --version` | at or above `v1.2.1` |

### BoilerplateV

Now that you have all the needed dependencies, you can install this generator with the following command: `npm install -g generator-boilerplatev-webpack`

That completes installation! So at this point you should have all the needed tools to start working BoilerplateV.

## Setup

When starting a new project, you will want to: open up a terminal/command prompt, make a new directory, and navigate into it.

```
mkdir my-new-project && cd my-new-project
```

then, run the BoilerplateV generator.

```
yo
```

then choose **`Boilerplatev Webpack`**.

Follow all the prompts and choose what suits you most for the project you would like to create. When you finish with all of the prompts, your project scaffold will be created and all dependencies will be installed.

> NOTE: If you choose to `skip installation` option, no dependencies will have been installed.
> You will need to run `yarn` in your project's root directory in order to get started running automated tasks

Once everything is installed, you will see a project structure like below:

```
├── tmp/                       	# Folder for temporary development output
├── src
|   ├── css                  	# Global css, mixins, variables, etc
|   |   └── main.scss         	# Main stylesheet (import everything to this file)
|   ├── icons                	# Icons (svg files) that will be generated as icon spritemap
|   ├── img		           	# Images
|   ├── js					  	# Global js, base classes, etc
|   |   └── main.js           	# Main entry js
|   ├── json                  	# JSON files that add data to templates
|   ├── pug               		# Layout structure for app
|   |   └── layouts
|   |       └── global.pug		# Global layout
|   |   └── mixins				# Pug mixins
|   |   └── partials			# Pug partials (e.g. header.pug and footer.pug)
|   |   └── global.pug
|   ├── static
|   ├── index.pug             	# Homepage template
└── package.json             	# Dependencies and site/folder configuration
```

Congratulations! You should now have successfully created a BoilerplateV project and are ready to start building out your site/app.

Now you can run the following tasks:

-   `yarn dev` for testing and building a development version of your site.
-   `yarn build` for building a production version of your site.

## Configuration

In the `package.json` file, within the root of the generated project, you have the ability to configure some project settings:

### Entry files

The `main` entry files are `src/js/main.js` and `src/css/main.scss` (configured in `webpack.common.js`). This will make sure `main.js` and `main.scss` are compiled.

# HTML

It will be generated using Pug (was Jade). Also, [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) is used to inject all the assets chunks (js, css, spritemap).

Since this build is, by default, targeted for ASP.NET MVC:

-   It will replace the `Layout.cshtml` in `Views/Shared/Layout.cshtml` with the one which has been injected with the chunks.
-   The plugin also ensures that the chunks are hashed so that it can be cached optimally.

# CSS

It will be generated using SCSS with the concept of BEM (Block Element Modifier) with ITCSS (Inverted Triangle CSS). To use the classes in the HTML, use utility classes in `src/css/05_utilities/*` to get the optimal size of CSS (combined with [PurgeCSS](https://github.com/FullHuman/postcss-purgecss), you'll get the smalllest CSS file possible).

## Framework

Default: [Bootstrap](http://getbootstrap.com/). The most important files for Bootstrap in this boilerplate are **\_settings.bootstrap.scss** and **\_generic.bootstrap.scss**

## ITCSS

(ref: https://speakerdeck.com/dafed/managing-css-projects-with-itcss)

Managing CSS at scale is hard; and a lot harder than it should be. ITCSS is a simple, effective, and as-yet unpublished methodology to help manage, maintain, and scale CSS projects of all sizes.
In this talk we’ll take a sneak peek at what ITCSS is and how it works to tame and control UI code as it grows.

The structure:

1. **Settings** - global variables, config switches, brand colours, etc.
2. **Tools** - Globally available tools, public mixins and helper functions.
3. **Generic** - Ground-zero styles (normalize.css, reset, box-sizing). Low specificity, far-reaching.
4. **Base** - Unclassed HTML elements (H1-H6, basic links, lists, etc). Last layer we see type selectors (e.g. a{}, blockqoute {}).
5. **Utilities** - generic utility, not an object. It's like win but without !important
6. **Objects** - Cosmetic-free design patterns, OOCSS, begin using classes exclusively, agnostically named (e.g. .ui-list {}).
7. **Components** - Designed components, chunks of UI, still only using classes, more explicitly named (e.g. .product-list {}).
8. **Theme** (optional).
9. **Win/Trumps** - Helpers and overrides. Usually carry !important.

**ITCSS** benefits:

-   Manages source order
-   Filters explicitness
-   Tames the cascade
-   Sanitizes inheritance

## BEM

(ref: http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)

**Important note:**
_Just because something happens to live inside a block it doesn’t always mean is is actually a BEM element_

## Icons

[svg-spritemap-webpack-plugin](https://github.com/cascornelissen/svg-spritemap-webpack-plugin) is used to generate icons spritemap, so that we can use the icon with just below syntax. With `html-webpack-plugin`, the spritemap will be added in the `Layout.cshtml` automatically.

```html
<svg width="[width]" height="[height]">
	<use xlink:href="#icon-name" />
</svg>
```

## PostCSS plugins

1. [Autoprefixer](https://github.com/postcss/autoprefixer) - Parse CSS and add vendor prefixes to rules by Can I Use
1. [Rucksack](http://simplaio.github.io/rucksack/) - A little bag of CSS superpowers
1. [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) - Convert pixel units to rem (root em) units using PostCSS
1. [PurgeCSS](https://github.com/FullHuman/postcss-purgecss) - Remove unused CSS.
1. [CSSNano](https://cssnano.co/) - Minify CSS.

### Tools/Mixins/Functions

**Important**:
Foundation mixins found [here](http://foundation.zurb.com/sites/docs/sass-mixins.html).

Notes:
It hasn't had any setup the task to generate more than 1 sprite. Please see [here](https://github.com/2createStudio/postcss-sprites) for reference.

## Javascript

The most important feature in this framework is [conditioner.js](https://github.com/rikschennink/conditioner). This enables us to write common-used scripts in a modular way. This way, your `main.js` won't be bloated and you can find whatever code applied to element easily.

To use conditioner.js is very easy:

1. Create your common-used script in `src/js/modules`. The script must export by default a function. The function has 3 parameters:
    - `el` - DOM object of an element where you put `data-module`
    - `$el` - jQuery object of `el`
    - `opts` - options that you want to pass on to your module in JSON string format
1. Add `data-module` attribute to the element you want the module to be applied to
    ```html
    <div data-module="slickjs" data-module-options="{ rows: 0 }"></div>
    ```

## Issues / Todo

1. **On first time run, it gives me a blank page with 'Error' only**

    `webpack-dev-server` will open a browser tab/window even though the build hasn't finished yet. Try reloading the page after the `webpack` build has finished.
