'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Write README.md
    this.fs.copyTpl(
      this.templatePath('README.md') ,
      this.destinationPath('README.md'),{
        projectName: pkg.name,
        description: pkg.description,
        license: pkg.license,
        authorName: pkg.author.name,
        authorUrl: pkg.author.url
      }
    ) ;
  }
});