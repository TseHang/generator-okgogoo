var Q = require('q');
var fs = require('fs-extra');
var FS = require("q-io/fs");
var stage = require('node-stage');
var path = require('path');
var npm = require('npm');

function initDir(dir, generator) {
  // generator_can default to 'Init'
  var generator_can = (generator) ? generator : 'Init';

  // dir default to  process.cwd()/generator_can
  dir = dir || path.resolve(process.cwd(), generator_can);
  var absolutePath = path.resolve(dir);


  // if generator not assign
  // make it 'Init', and then mkdir,copydir
  if (!generator) {
    var generator_path = path.resolve(__dirname, '../../init');
    return _mkdir(absolutePath)
      .then(_copydir(generator_path, absolutePath, generator_can));
  }

  // if generator assign
  // load npm , and get prefix
  // var generator_can = generator + '-can';
  // stop using -can to get generator_can
  var generator_path;

  // check if module exist
  // if exist, mkdir, copydir
  return Q.nfcall(npm.load, {
    global: true
  })

  // get config from npm config, and check if package exist
  .then(function pkgExist() {
    var prefix = npm.config.get('prefix');
    generator_path = prefix + '/lib/node_modules/' + generator_can;
    return FS.exists(generator_path);
  })

  // mkdir the absolutePath
  .then(function(bool) {
    if (!bool) // not exist
      throw new Error('You haven\'t install can "' + generator_can + '"');
    return _mkdir(absolutePath);
  }, function(err) {
    throw err;
  })

  //copy generator_path to absolutePath
  .then(function() {
    return _copydir(generator_path, absolutePath, generator_can);
  }, function(err) {
    throw err;
  })
}



function _copydir(generator_path, dir, generator) {
  var deferred = Q.defer();
  var gen_path = path.resolve(generator_path);
  var exist_ignore = fs.existsSync(path.join(gen_path, '.canignore'));

  if (exist_ignore)
    var ignore_arr = _parseIgnore(gen_path) || [];
  else
    var ignore_arr = [];

  var filter = function(s) {
    var base = path.basename(s);
    var first = base.charAt(0);

    return base !== "package.json" && first !== "." && ignore_arr.indexOf(base) === -1;
  }

  // copy
  fs.copy(gen_path, dir, filter, function(err) {
    if (err) {
      deferred.reject("Copy error: " + err);
    } else {
      stage.success('Done! Initialized your project using generator "' + generator + '" ! Checkout directory: ' + dir);
      deferred.resolve();
    }
  })

  return deferred.promise;
}

function _mkdir(dir) {
  // building directories
  var deferred = Q.defer();
  stage.process('Building the directories...')

  // mkdir
  fs.mkdir(dir, function(err) {
    if (err) {
      deferred.reject(new Error('The directory is already exist!'));
    } else {
      stage.success('Successfully build directory...')
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function _parseIgnore(gen_path) {
  var ignore_file = fs.readFileSync(path.join(gen_path, '.canignore'), {
    encoding: 'utf8'
  });
  return ignore_file.match(/[^\r\n]+/g);
}

module.exports = initDir;
