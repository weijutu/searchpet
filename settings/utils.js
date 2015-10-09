var yaml = require('js-yaml');
var fs = require('fs');

exports.getConfig = function(){
	try {
		var doc = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
	  	return doc;
	} catch (e) {
	  	console.log(e);
	}
};