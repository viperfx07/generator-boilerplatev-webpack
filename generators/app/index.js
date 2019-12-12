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
				name: 'hasVueStyleguide',
				message: 'Do you want to add vue-styleguide',
				default: false,
			},
			{
				type: 'list',
				name: 'dirStructure',
				message: 'Directory structure standard',
				choices: ['Kentico', 'Umbraco', 'None'],
				default: 'Kentico',
			},
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
			this.baseline = answers.baseline
			this.skipInstall = answers.skipInstall
			this.dirStructure = answers.dirStructure
			this.jsFramework = answers.jsFramework
		})
	}
	writing() {
		var dirByStructures = {
			Kentico: {
				assets: '/www_shared/assets',
				otherWWW: '../',
			},
			Umbraco: {
				assets: '/static',
				otherWWW: '../XXX.Web',
			},
			None: {
				assets: '/assets',
				otherWWW: '',
			},
		}

		var config = {
			projectName: this.projectName,
			skipInstall: this.skipInstall,
			hasVueStyleguide: this.hasVueStyleguide,
			assetsDir: dirByStructures[this.dirStructure].assets,
			otherWWW: dirByStructures[this.dirStructure].otherWWW,
			baseline: this.baseline,
			_: underscore,
			pkg: pkg,
		}

		// Files
		const copyTplDirs = [
			'cshtml/',
			'src/',
			'src/css/',
			'src/icons/',
			'src/img/',
			'src/js/',
			'src/json/',
			'src/pug/',
			'src/static/',
		]

		copyTplDirs.forEach(dir => {
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
