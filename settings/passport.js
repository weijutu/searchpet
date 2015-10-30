var async = require('async');
var request = require('request');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var Client = require('node-rest-client').Client;
client = new Client();


module.exports = function(passport){
	
	// //login 
	// passport.use('login', new LocalStrategy({		
	// 	passReqToCallback: true
	// }, function(req, username, password, done){

	// 	console.log('passport username:', username);
	// 	console.log('passport password:', password);

	// 	if (!req.body) return res.json({ isError: true, error: 'no data' });

	// 	var username = req.body.username;
	// 	var password = req.body.password;

	// 	//登入機制執行
	// 	// async.waterfall([
	// 	// 	function(callback){
	// 	// 		var args = {
	// 	// 			data: {
	// 	// 				"auth": {
	// 	// 					"username": username,
	// 	// 					"password": password
	// 	// 				}
	// 	// 			},
	// 	// 			headers: { "Content-Type": "application/json" }
	// 	// 		};
	// 	// 		console.log('passport args:', args);
	// 	// 		callback(null, args);
	// 	// 	}
	// 	// ], function(error, access) {
	// 	// 	console.log('error:', error);
	// 	// 	console.log('access:', access);
	// 	// 	if (error) throw error;

	// 	// 	if (access) {
	// 	// 		console.log('access.user.username:',access.user.username);
	// 	// 		console.log('access.user.id:', access.user.id);
	// 	// 	}

	// 	// 	return done(null, access);
	// 	// });
	// 	return done(null, { success: true });
	// 	// return done(null, username);
	// }));


	// //used to serialize the user for the session
	// passport.serializeUser(function(user, done) {
	// 	// console.log('serialize:', user);
 //        done(null, user);
 //    });

 //    // used to deserialize the user
 //    passport.deserializeUser(function(id, done) {
 //    	done(null, id);
 //    });
};