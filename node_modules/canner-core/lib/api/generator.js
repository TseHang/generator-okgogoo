var fs = require('fs');
var path = require('path');

var Q = require('q');
var _ = require('lodash');
var fs_save = require('file-save');
var async = require('async');
var YAML = require('yamljs');
var stage = require('node-stage');
var chalk = require('chalk');
var minify = require('html-minifier').minify;

var md = require('./markdown');
var engine = require('./engine');

// reading canner.json
var _readSettings = function(settings) {
  if (_.isArray(settings))
    return Q(settings);
  else if (_.isObject(settings))
    return Q([settings]);

  var canner;

  return _readJSON(settings).then(function(data) {
    canner = data;
    if (canner instanceof Array) {
      return canner;
    } else {
      return [canner];
    }
  }, function(err) {
    stage.error('Can\'t find no canner.json file.');
    stage.error(err);
    process.exit(2);
  });
};

// Reading canner.json file.
var _readJSON = function(settings) {
  var d = Q.defer();
  var ext = path.extname(settings).toLowerCase();
  if (ext === '.yaml' || ext === '.yml') {
    // yaml, yml
    fs.readFile(path.join(settings), {
      encoding: 'UTF-8'
    }, function(err, data) {
      if (err) {
        d.reject(new Error(err));
      } else {
        try {
          var data = YAML.parse(data);
        } catch (e) {
          stage.error('Your canner configuration file canner.yml or canner.yaml parse error.');
          stage.error(e);
        }
        d.resolve(data);
      }
    });

  } else if (ext == '.js') {
    // js
    var data = require(path.resolve(settings));
    d.resolve(data);
  } else if (ext === '.json') {
    // json
    fs.readFile(path.join(settings), {
      encoding: 'UTF-8'
    }, function(err, data) {
      if (err) {
        d.reject(new Error(err));
      } else {
        //parse
        try {
          data = JSON.parse(data);
        } catch (e) {
          stage.error('Your canner configuration file canner.json parse error.')
          stage.error(e);
        }

        d.resolve(data);
      }
    });
  } else {
    d.reject(new Error('Setting file format is not support'));
  }

  return d.promise;
}


// Reading layout.
var _setLayout = function(dir, layout) {
  var d = Q.defer();
  var layoutPath = path.resolve(dir, layout);

  fs.readFile(layoutPath, {
    encoding: 'UTF-8'
  }, function(err, layout) {
    if (err) {
      d.reject(new Error(err));
    } else {
      d.resolve(layout);
    }
  })

  return d.promise;
}

// gnerating docs
exports.build = function(output, settings, tmp_engine, opts) {
  var dir = opts.cwd || path.dirname(settings);

  // filter settings
  if(opts.filter)
    settings= _.filter(settings, opts.filter)

  return _readSettings(settings).then(function(settings) {
    var count = 0;
    var tasks = settings.map(function(page) {
      if (page.filename) {
        var filename = page.filename
      } else {
        if (count !== 0) {
          var filename = 'index' + count + '.html';
        } else {
          var filename = 'index.html';
        }
        count++;
      }

      return Q.fcall(function() {
        return _setLayout(dir, page.layout);
      })

      .then(function(data) {
        // rendering layout with content.
        // get content from opts, or in settings
        var content = opts.data || page.data;
        var layout = data;

        if (tmp_engine === 'hbs' || tmp_engine === 'handlebars') {
          var helpers = page.helpers || null;
          var partials = page.partials || null;
          return engine.hbsLayout(content, layout, dir, helpers, partials, opts.hbs);
        } else if (tmp_engine === 'nunjucks') {
          return engine.nunLayout(content, layout, dir);
        } else if (tmp_engine === 'jade') {
          return engine.jadeLayout(content, layout, dir);
        } else if (tmp_engine === 'swig') {
          return engine.swigLayout(content, layout, dir);
        } else if (tmp_engine === 'mustache') {
          return engine.musLayout(content, layout, dir);
        } else if (tmp_engine === 'dust') {
          return engine.dustLayout(content, layout, dir);
        }

      }, function(err) {
        stage.error(err);
      })

      .then(function(layout) {
        return md(layout, dir);
      }, function(err) {
        stage.error(err);
      })

      .then(function(build) {
        var deferred = Q.defer();
        var fs_path = path.join(output, filename);
        var save = function(build) {
          fs_save(fs_path)
            .write(build)
            .end()
            .finish(function() {
              stage.success('File save to ' + chalk.magenta(fs_path));
              deferred.resolve();
            })
        }

        // nltobr
        if (opts.nltobr)
          build = build.replace(/(?:\r\n|\r|\n)/g, '<br />');

        // return the html
        if (opts.returnContent)
          return build;

        if (opts.minify) {
          var opt = {
            "minifyCSS": true,
            "minifyJS": true,
            "removeComments": true,
            "collapseWhitespace": true
          };
          build = minify(build, opt);
        }

        if (opts.beforeSave)
          opts.beforeSave(build, function(build) {
            save(build);
          });
        else
          save(build);

        return deferred.promise;
      }, function(err) {
        stage.error(err);
      });
    });

    return Q.all(tasks);
  });

};
