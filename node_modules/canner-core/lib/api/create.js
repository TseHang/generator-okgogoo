var _ = require('lodash');
var path = require('path');
var Q = require('q');
var FS = require("q-io/fs");
var util = require('util');
var hbs_extract = require('hbs-extract');

module.exports = function(hbsPath, options) {
  var cannerJson = {
    layout: './index.hbs',
    filename: './index.html',
    data: {},
    columns: {},
    seq: []
  };
  
  return hbs_extract.fromFile(hbsPath, afterKeyCreate)
    .then(function(result) {
      cannerJson.data = result;
      if (options.print) {
        return console.log(JSON.stringify(cannerJson, null, 4));
      }
      if (options.extend) {
        var source = require(path.resolve(process.cwd(), options.extend));
        _.assign(cannerJson, source);
      }
      
      return FS.write(options.outputPath, JSON.stringify(cannerJson, null, 4))
        .then(function() {
          console.log('successfully output result to', options.outputPath);
        });
    })
    .catch(function(error) {
      console.log(error);
    });

  // add columns and seqs to cannerJson
  function afterKeyCreate(path) {
    
    // root keys
    if (!cannerJson.columns.hasOwnProperty(path[0])) {
      cannerJson.columns[path[0]] = { 
        '~description': '',
        '~format': ''
      };
      return cannerJson.seq.push(path[0]);
    }

    _deepInsert(cannerJson.columns, path);
  }
};


function _deepInsert(data, path) {

  for (var i = 0; i < path.length; ++i) {
    var key = path[i];

    if (!data.hasOwnProperty(key)) {
      data[key] = {
        '~description': '',
        '~format': ''
      };
    }

    if (i < (path.length-1)) {
      delete data[key]['~format'];
    }
    data = data[key];
  }
}


