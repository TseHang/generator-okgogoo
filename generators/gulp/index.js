'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var mkdirp = require('mkdirp');

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
    mkdirp('bin');
    mkdirp('layout');
    mkdirp('layout/partial');
  },

  writing: function () {

    var defaultFileList= [{
      src:'initial.mp3',
      dist:'dist/audio/initial.mp3'
    },{
      src:'initial.png',
      dist:'dist/img/initial.png'
    },{
      src:'_index.scss',
      dist:'sass/index.scss'
    },{
      src:'_index.js',
      dist:'js/index.js'
    },{
      src:'_index.hbs', 
      dist: 'layout/index.hbs'
    },{
      src:'_head.hbs',
      dist: 'layout/partial/head.hbs'
    }, {
      src:'_normalize.css',
      dist: 'src/normalize.css'
    }, {
      src:'_gulpfile.js',
      dist: 'gulpfile.js'
    }, {
      src:'_partial.js',
      dist: 'partial.js'
    }, {
      src:'_route.js',
      dist: 'route.js'
    },{
      src:'_config.rb',
      dist: 'config.rb'
    },{
      src:'_build',
      dist: 'bin/build'
    }];

    (function _fsCopyList(fileArray){
      fileArray.forEach(function(value){
        this.fs.copy(this.templatePath(value.src) , this.destinationPath(value.dist)) ;
      }.bind(this))
    }.bind(this))(defaultFileList);
  },

  install: function() {
    var packages = {
      save_dev:[
        'gulp',
        'gulp-clean-css',
        'gulp-compass',
        'gulp-concat',
        'gulp-imagemin',
        'gulp-minify-css',
        'gulp-plumber',
        'gulp-rename',
        'gulp-uglify'
      ],
      save: [
        'minimist',
        'chalk',
        'canner-core'
      ]
    };

    this.npmInstall(packages.save_dev, {'save-dev': true});
    this.npmInstall(packages.save, {'save': true});
  }
});