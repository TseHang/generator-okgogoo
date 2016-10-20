

function Source () {
	// Source constructor
}

Source.prototype.read = function(filePath) {
	// return file content
};

Source.prototype.createReadStream = function(filePath) {
	// return a readStream
};

Source.prototype.init = function(dir, generator) {
	// init a app with a can
};

Source.prototype.build = function(output, cannerJson, tmp_engine, options) {
	// build using a template
};

Source.prototype.create = function(hbsPath, options) {
  // create a canner.json
}

module.exports= Source;
