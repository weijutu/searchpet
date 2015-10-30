var yaml = require('js-yaml');
var fs = require('fs');
var dateFormat = require('dateformat');
var moment = require('moment');
var uuid = require('node-uuid');

exports.getConfig = function(){
	try {
		var doc = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'));
	  	return doc;
	} catch (e) {
	  	console.log(e);
	}
};

exports.getUniqeId = function(){
	return uuid.v4();
};

exports.getTodayDate = function(){
	var now = new Date();
	var nowTime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
	return nowTime;
};
