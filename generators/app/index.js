'use strict'

var Generator = require('yeoman-generator')
var underscore = require('underscore.string')
var updateNotifier = require('update-notifier')
var pkg = require('../../package.json')
require('colors')

module.exports = class extends Generator {
	initializing() {
		updateNotifier({
			pkg: pkg,
			updateCheckInterval: 0,
		}).notify()
	}
	prompting() {
		this.log('----------------------------------------------------'.green)
		this.log('    --------------------------------------------  '.cyan)
		this.log('                                                ')
		this.log('                 BOILERPLATEV Webpack         '.yellow)
		this.log('                 v' + pkg.version.yellow)
		this.log('                                                ')
		this.log('    --------------------------------------------  '.cyan)
		this.log('----------------------------------------------------'.green)

		return this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'Project Name',
				default: this.appname, // Default to current folder name
			},
			{
				type: 'confirm',
				name: 'replaceRazorLayout',
				message: 'Replace Views/Shared/Layout.cshtml',
				default: true,
			},
			// {
			// 	type: 'list',
			// 	name: 'dirStructure',
			// 	message: 'Directory structure standard',
			// 	choices: ['Kentico', 'Umbraco', 'None'],
			// 	default: 'Kentico',
			// },
			{
				type: 'input',
				name: 'baseline',
				message: 'Baseline (in px size)',
				default: '8', // Default to current folder name
			},
			{
				type: 'confirm',
				name: 'skipInstall',
				message: 'Do you want to skip yarn install?',
				default: false,
			},
		]).then(answers => {
			this.projectName = answers.name
			this.replaceRazorLayout = answers.replaceRazorLayout
			this.baseline = answers.baseline
			this.skipInstall = answers.skipInstall
			this.dirStructure = answers.dirStructure
			this.jsFramework = answers.jsFramework
		})
	}
	writing() {
		const config = {
			...this,
			_: underscore,
			pkg: pkg,
		}

		const { replaceRazorLayout } = this

		// Files
		const copyTplDirs = [
			replaceRazorLayout ? 'cshtml/' : '',
			'src/',
			'src/css/',
			'src/icons/',
			'src/img/',
			'src/js/',
			'src/json/',
			'src/pug/',
			'src/static/',
		]

		copyTplDirs
			.filter(item => !!item)
			.forEach(dir => {
				this.fs[dir.includes('cshtml') ? 'copy' : 'copyTpl'](
					this.templatePath(dir),
					this.destinationPath(dir.replace('*', '')),
					config,
				)
			})

		// Copy all the files in the root
		this.fs.copyTpl(this.templatePath('*.*'), this.destinationRoot(), config)
		this.fs.copy(this.templatePath('.*'), this.destinationRoot())
	}
	install() {
		if (!this.skipInstall) {
			this.yarnInstall()
		}
	}
}
