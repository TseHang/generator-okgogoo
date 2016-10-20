// source
var LocalSource= require('./source/local');

function Canner (args) {
	args= args || {};
	// constructor
	this.source= (args.source)
		? new args.source()
		: new LocalSource();
}

Canner.prototype.init = function(dir, generator) {
	return this.source.init.apply(this.source, arguments);
};

Canner.prototype.build = function(cannerJson, options, watchOpt) {
	return this.source.build.apply(this.source, arguments);
};

Canner.prototype.read = function(can, filePath) {
	return this.source.read.apply(this.source, arguments);
};

Canner.prototype.createReadStream = function(can, filePath) {
	return this.source.createReadStream.apply(this.source, arguments);
};

Canner.prototype.create = function(hbsfile, options) {
	return this.source.create.apply(this.source, arguments);
}

module.exports= Canner;
