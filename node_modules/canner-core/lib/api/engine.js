var path = require('path');
var fs = require('fs');

var Q = require('q');

var hbs = require('handlebars');
var nun = require('nunjucks');
var jade = require('jade');
var swig = require('swig');
var mus = require('mustache');
var dust = require('dustjs-linkedin');
var beautify = require('js-beautify').html_beautify;
var _ = require('lodash');
var hbsHelpers = require('hbs-helper').getHelper();

// render handlebars layout
var hbsLayout = function(content, source, dir, helpers, partials, opts) {

  if (helpers) {
    if (!_.isArray(helpers))
      helpers = [helpers];

    helpers.forEach(function(helper) {
      if (hbsHelpers.hasOwnProperty(helper)) {
        hbsHelpers[helper](hbs);
      }
      else {
        require(path.resolve(dir, helper))(hbs);
      }
    });
  }

  if (partials) {
    if (!_.isArray(partials))
      partials = [partials];

    partials.forEach(function(partial) {
      var partial_path = path.resolve(dir, partial);
      if (fs.lstatSync(partial_path).isDirectory()) {
        _registerPartialByDir(partial_path);
      }
      else {
        require(partial_path)(hbs);
      }
    });
  }
  
  var temp = hbs.compile(source, opts);

  var layout_html = temp(content);

  return layout_html;
};

var nunLayout = function(content, source, dir) {
  var layout_html = nun.renderString(source, content);

  return layout_html;
}

var jadeLayout = function(content, source, dir) {
  var fn = jade.compile(source, {
    pretty: true
  });
  var layout_html = fn(content);

  return layout_html;
}

var swigLayout = function(content, source, dir) {
  var layout_html = swig.render(source, {
    locals: content
  });

  return layout_html;
}

var musLayout = function(content, source, dir) {
  var layout_html = mus.render(source, content);

  return layout_html;
}

var dustLayout = function(content, source, dir) {
  var compiled = dust.compile(source, "canner");
  dust.loadSource(compiled);
  var d = Q.defer();

  dust.render("canner", content, function(err, out) {
    if (err) {
      d.reject(new Error(err));
    } else {
      var html = beautify(out);
      d.resolve(html);
    }
  });

  return d.promise;
}

function _registerPartialByDir(template_path) {
  fs.readdirSync(template_path).forEach(function (file) {
    if (file.indexOf('.html') >= 0){
      var pratial = file.split('.')[0];
      hbs.registerPartial(pratial, _getTemplate(template_path + '/' + file));
    }
  });
}

function _getTemplate(file) {
  var template = fs.readFileSync(file, {encoding: 'utf8'});
  return template;
}

module.exports = {
  hbsLayout: hbsLayout,
  nunLayout: nunLayout,
  jadeLayout: jadeLayout,
  swigLayout: swigLayout,
  musLayout: musLayout,
  dustLayout: dustLayout
}
