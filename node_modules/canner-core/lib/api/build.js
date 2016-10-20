var path = require('path');
var Q = require('q');
var _ = require('lodash');
var localdir = require('localdir');
var fs = require('fs');
var stage = require('node-stage');
var watch = require('watch');
var httpServer = require('http-server');
var chalk = require('chalk');

var generator = require("./generator");

/*
 *  Build
 *  Build a canner from a canner.json
 *  @param {string | Object} cannerJson - source to canner.json, default ./canner.json
 *  or a object, containing canner.json settings
 *  @param {object} options - options
 *  @param {boolean} watchOpt - whether watch the folder or not
 */

module.exports = function(cannerJson, options, watchOpt) {
  if(_.isString(cannerJson))
    var cannerParentDir= path.join(process.cwd(), cannerJson, '..');
  else
    var cannerParentDir= process.cwd();
  // output is the dir path where content will be generated
  var output = options.output || cannerParentDir;
  // serveDir
  var serveDir = options.serve || cannerParentDir;
  // template engine
  var tmp_engine = options.engine || 'hbs';
  // cannerJson default to local dir path
  cannerJson = cannerJson || './canner.json';

  // see if we need to open localhost, for convinience
  if (serveDir !== undefined && options.localhost) {
    var server = httpServer.createServer();
    var host = '127.0.0.1';
    var port = options.port || 4000;
    server.listen(port, host);
    stage.success('Serving "' + serveDir + '" at http://localhost:' + port);
  }

  // if watch needed, start file watch
  if (watchOpt) {
    _watchFs(serveDir, cannerJson, output, options);
    stage.process('Watching files under \'' + chalk.cyan(serveDir) + '\'...');
  }

  // generate
  stage.process('Starting \'' + chalk.cyan('build')  + '\'...');
  return generator.build(output, cannerJson, tmp_engine, options);
};

var _regenerateDoc = function(monitor, dir, cannerJson, output, options, filter) {
  var rebuildAndWatch= function (cannerJson) {

    var tmp_engine = options.engine || 'hbs';
    var buildPromise= generator.build(output, cannerJson, tmp_engine, options);

    // if watch callback exist
    if(options.watchCallback)
      buildPromise.then(options.watchCallback);

    // catch error
    buildPromise.catch(function(err) {
        stage.error(err);
    });

    // watch again
    _watchFs(dir, cannerJson, output, options);
  };

  // remove all listeners
  monitor.removeAllListeners();

  // reload settings
  if(!options.reloader)
    rebuildAndWatch(cannerJson);
  else
    Q.when(options.reloader()).then(function (cannerJson) {
      if(filter)
        cannerJson= _.filter(cannerJson, filter);
      rebuildAndWatch(cannerJson);
    });
}

var _watchFs = function(dir, cannerJson, output, options) {
  var filter= function (f) {
    var filename;

    if(_.isString(cannerJson)){
      try {
        var load = JSON.parse(fs.readFileSync(cannerJson, 'utf8'));
      } catch (e){
        // not a json file a commonjs file.
        var load = fs.readFileSync(cannerJson, 'utf8');
      }

      if(Object.prototype.toString.call(load)=='[object Array]') {
        // if it is array then multi filename
        var load = load.map(function(item) {
          return item.filename || './index.html';
        })

        filename = load;

      }else {
        // an object, one item
        filename = load.filename || './index.html';
        filename = [filename];
      }
    }else{
      filename= './canner.json';
      filename = [filename];
    }

    var f_arr = filename.map(function(fname){
      return path.join(output, fname)
    })

    // exclude filename in cannerJson
    return (f_arr.indexOf(f) === -1);
  }
  dir = path.resolve(dir);
  watch.createMonitor(dir, {filter: filter}, function(monitor) {

    monitor.on("created", function(f, stat) {
      // Handle new files
      monitor.stop();
      stage.process("File " + f + " have been created. ");

      // filter
      if(options.createFilter)
        var filter= function (row) {
          return options.createFilter(row, f, stat);
        };

      // generate
      _regenerateDoc(monitor, dir, cannerJson, output, options, filter);
    });
    monitor.on("changed", function(f, curr, prev) {
      // Handle file changes
      monitor.stop();
      stage.process("File " + f + " have been changed. ");

      // filter
      var filter;
      if(options.changeFilter)
        filter= function (row) {
          return options.changeFilter(row, f, curr, prev);
        };

      // generate
      _regenerateDoc(monitor, dir, cannerJson, output, options, filter);
    });
    monitor.on("removed", function(f, stat) {
      // Handle removed files
      monitor.stop();
      stage.process("File " + f + " have been removed. ");

      // filter
      var filter;
      if(options.removeFilter)
        filter= function (row) {
          return options.removeFilter(row, f, stat);
        };

      // generate
      _regenerateDoc(monitor, dir, cannerJson, output, options, filter);
    });

  });
};
