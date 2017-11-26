/*
  【ask】
    this.pkg ?

*/
'use strict';
const _ = require('lodash');
const chalk = require('chalk');
const yosay = require('yosay');
const generators = require('yeoman-generator');
const askName = require('inquirer-npm-name');
const parseAuthor = require('parse-author');
const mkdirp = require('mkdirp');

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor.
  constructor: function () {
    generators.Base.apply(this, arguments);
    
    this.log(yosay(
      `Hello, my name is ${chalk.red('Okgogoo')}! Let's Go~~~~~~~~~~~~~~~`
    ));
  },

  initializing : function () {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      templateType: this.pkg.templateType,
      templateTypeList: ['Gogo Frontend']
    };

    // Push Author
    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      const info = parseAuthor(this.pkg.author);

      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  },

  prompting:{
    askForProjectName: function() {
      if(this.pkg.name || this.options.name) {
        this.props.name = this.pkg.name || _.kebabCase(this.options.name); // kebabCase : 'food bar' -> 'food-bar'
        return;
      }

      /*
        If the value is already used as a npm package, 
        then the users will be prompted and asked if they want to choose another one.
        If so, we'll recurse through the same validation process until 
        we have a name that is unused on the npm registry
      */
      return askName({
        name: 'name',
        message: 'Your project name: ',
        default: this.appname, // Default to current folder name
        filter: _.kebabCase,
        validate: function(str) {
          return str.length > 0;
        }
      }, this).then(function(answer) {
        this.props.name = answer.name;
      }.bind(this));
    },

    askForType: function() {
      return this.prompt([{
        type: 'list',
        name: 'templateType',
        message: 'Choose a '+ chalk.red.bold('module') + ' go !',
        choices: this.props.templateTypeList,
        default: this.props.templateTypeList[0],
        when: !this.props.templateType || checkTemplateExist(this.props, this.props)
      }, {
        type: 'confirm',
        name: 'eslint',
        message: 'Do you need eslint ?',
        default: 'Y',
        when: !this.props.eslint
      }, {
        type: 'confirm',
        name: 'eslint_in_global',
        message: 'Is your eslint in global?',
        default: 'Y',
        when: this.props.eslint_in_global
      }]).then(function(answer) {
        this.props = _.merge(this.props, answer);
      }.bind(this));
    },

    askDefault: function(){
      return this.prompt([{
        type    : 'input',
        name    : 'description',
        message : 'Write some description:',
        default : 'Call me uncle, baby~',
        when: !this.props.description
      }, {
        type: 'input',
        name:'homepage',
        message: 'Project homepage url: ',
        when: !this.props.homepage
      }, {
        type: 'input',
        name:'authorName',
        message: 'Author\'s Name: ',
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      }, {
        type: 'input',
        name: 'authorEmail',
        message: 'Author\'s Emai: ',
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      }, {
        type: 'input',
        name:'authorUrl',
        message: 'Author\'s Url: ',
        when: !this.props.authorUrl,
        store: true
      }, {
        type: 'input',
        name:'keywords',
        message: 'Keywords(Splitting with space): ',
        when: !this.props.keywords,
        store: true
      }]).then(function (answers) {
        this.props = _.merge(this.props, answers);
        this.log(chalk.red('\n\nIt\'s my pleasure to serve you, ' +this.props.authorName + "..."));
      }.bind(this));
    }
  },

  writing: {
    default: function () {
      console.log(chalk.red('Start writing...\n'));

      // write package.json
      var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
      var newPkg = _.merge({
        name: _.kebabCase(this.props.name),
        version: '0.0.0',
        description: this.props.description,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          url: this.props.authorUrl
        },
        main: 'index.js',
        keywords: _.uniq(this.props.keywords.split(' ')),
        type: this.props.templateType
      }, currentPkg);

      if(this.props.homepage) {
        newPkg.homepage = this.props.homepage;
        newPkg.repository = {
          type: 'git',
          url: `git+https://github.com/${this.props.authorName}/${this.props.name}.git`
        },
        newPkg.bugs = {
          url: `https://github.com/${this.props.authorName}/${this.props.name}/issues/`
        };
      }

      if(checkTemplateExist(this.props, newPkg)) {
        newPkg.templateType = this.props.templateType;
      }

      this.fs.writeJSON(this.destinationPath('package.json'), newPkg);
      this.fs.copyTpl(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
    },

    composeWithType: function(){
      this.composeWith('okgogoo:static');
      if(this.props.eslint) {
        this.composeWith('okgogoo:eslint', {
          options: {
            eslint_in_global: this.props.eslint_in_global,
          }
        }, {
          local: require.resolve('../eslint')
        });
      }
      switch(this.props.templateTypeList.indexOf(this.props.templateType)) {
        case 0:
          this.composeWith('okgogoo:gulp-frontend');
          break;
        default:
          this.composeWith('okgogoo:gulp-frontend');
          break;
      }

    }

  },

  end: function () {
    this.log(yosay(
      chalk.green.underline.bold('OK! GO! GO!')
    ));
  }

});


function checkTemplateExist(thisProject, otherProject) {
  return thisProject.templateTypeList.indexOf(otherProject.templateType) === -1
}