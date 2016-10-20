var fs= require('fs');
var FS= require('q-io/fs');
var path= require('path');
var npm= require('npm');
var Q= require('q');

exports.file= function (can, filePath) {
	return getNpmPath(can, filePath)

	// get config from npm config, and check if package exist
	.then(function readFile(absolutePath) {
		return FS.read(absolutePath);
	})
}

exports.stream= function (can, filePath) {
	return getNpmPath(can, filePath)

	.then(function readFile(absolutePath) {
		return fs.createReadStream(absolutePath);
	})
}

// private function
function getNpmPath (can, filePath) {
	return Q.nfcall(npm.load, {
		global: true
	})

	// get config from npm config, and check if package exist
	.then(function readFile() {
		var prefix = npm.config.get('prefix');
		//can= <name>-can
		absolutePath = path.join(prefix, 'lib/node_modules/', can, filePath);
		return absolutePath;
	})
}