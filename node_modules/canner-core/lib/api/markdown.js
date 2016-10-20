// markdown generater.
var async = require('async');
var Q = require('q');
var md_attr = require('md-attr');


var fs = require('fs');
var path = require('path');

var md = function(content, dir) {
  var d = Q.defer();

  md_attr.html(content, dir, function(mdbuild) {
    return d.resolve(mdbuild);
  })

  return d.promise;
}


module.exports = md
