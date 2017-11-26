'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var chalk = require('chalk');

module.exports = generators.Base.extend({
  initializing: function(){
    // default dictionary
    mkdirp('dist');
    mkdirp('dist/css');
    mkdirp('dist/img');
    mkdirp('dist/js');
    mkdirp('dist/audio');
    mkdirp('js');
    mkdirp('lib');
    mkdirp('sass');
    mkdirp('src');
    mkdirp('layout');
    mkdirp('layout/partial');
  },

  writing: function () {

    var defaultFileList= [{
      src:'initial.png',
      dist:'dist/img/initial.png'
    }, {
      src:'_index.scss',
      dist:'sass/index.scss'
    }, {
      src:'_index.js',
      dist:'js/index.js'
    }, {
      src:'_index.hbs', 
      dist: 'layout/index.hbs'
    }, {
      src:'_head.hbs',
      dist: 'layout/partial/head.hbs'
    }, {
      src:'_footer.hbs',
      dist: 'layout/partial/footer.hbs'
    }, {
      src:'_gulpfile.js',
      dist: 'gulpfile.js'
    }, {
      src:'_partial.js',
      dist: 'partial.js'
    }, {
      src:'_hbsRouter.js',
      dist: 'hbsRouter.js'
    }, {
      src:'_config.rb',
      dist: 'config.rb'
    }];

    (function _fsCopyList(fileArray){
      fileArray.forEach(function(value){
        this.fs.copy(this.templatePath(value.src) , this.destinationPath(value.dist)) ;
      }.bind(this))
    }.bind(this))(defaultFileList);
  },

  install: function() {
    var modules = [
      'gulp',
      'gulp-compass',
      'gulp-concat',
      'gulp-imagemin',
      'gulp-plumber',
      'gulp-rename',
      'gulp-clean-css',
      'gulp-uglify',
      'gulp-hbs-router',
      'gulp-webserver',
      'gulp-minify-html',
      'gulp-babel',
      'chalk',
      'babel-core',
      'babel-preset-es2015',
    ];
    this.npmInstall(modules, {save: true});
    console.log(chalk.yellow('Setting gulp-frontend-start...'))
  }
});