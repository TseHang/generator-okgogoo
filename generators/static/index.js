'use strict';

var generators = require('yeoman-generator');
var _ = require('lodash');
var mkdirp = require('mkdirp');

module.exports = generators.Base.extend({

  writing: function () {

    var pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    var _copyReadme = function(moduleReadmeIn, moduleReadmeOut, readme){
      this.fs.copy(
        this.templatePath(moduleReadmeIn),
        this.destinationPath(moduleReadmeOut)
      )

      // Write README.md
      this.fs.copyTpl(
        this.templatePath(readme),
        this.destinationPath('README.md'), {
          projectName: pkg.name,
          description: pkg.description,
          license: pkg.license,
          authorName: pkg.author.name,
          authorUrl: pkg.author.url
        }
      );
    }.bind(this);

    if(pkg.templateType === 'Gogo Frontend'){
      _copyReadme('GoGoFrontend.md', 'GoGoFrontend.md', 'GogoF_README.md');
    }
    
  }
});