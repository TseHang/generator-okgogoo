var path = require('path');
var Q = require('q');
var _ = require('lodash');
var fs = require('fs');
var npm = require('npm');
var FS = require("q-io/fs");

// apis
var build = require('../api/build');
var init = require('../api/init');
var reader= require('../api/reader');
var create= require('../api/create');

function LocalSource () {
	// Source constructor
}

LocalSource.prototype.read = function(can, filePath) {
	return reader.file(can, filePath);
};

LocalSource.prototype.createReadStream = function(can, filePath) {
	return reader.stream(can, filePath);
};

LocalSource.prototype.init = function(dir, generator) {
	// init a app with a can
	return init(dir, generator);
};

LocalSource.prototype.build = function(cannerJson, options, watchOpt) {
	// build using a template
	return build(cannerJson, options, watchOpt);
};

LocalSource.prototype.create = function(hbsfile, options) {
  return create(hbsfile, options);
}


module.exports= LocalSource;
