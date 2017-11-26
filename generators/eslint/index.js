'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  initializing: function() {
    this.props = {
      global: this.options.eslint_in_global
    }
  },

  writing: function(a) {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.fs.copy(
      this.templatePath('eslintrc.js'),
      this.destinationPath('.eslintrc.js')
    );
    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );
  },

  install: function() {
    var modules = [
      'eslint-config-airbnb-base',
      'eslint-plugin-import'
    ];
    if (!this.props.global) modules.push('eslint');

    this.npmInstall(modules, {save: true});
    console.log(chalk.yellow('Setting eslint...'))
  }
});
