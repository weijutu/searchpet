var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var cases = require('../models/case.js');
var component = require('../models/component.js');
var picture = require('../models/picture.js');
var member_role = require('../models/member_role.js');
var office_role = require('../models/office_role.js');

function cases_info(c){

}

cases_info.prototype.getCases = function(cb){
	var c = new cases({});
    var animals;
    c.getCases(function(error, results){
        // console.log('animals result:', results);
        animals = results;
        console.log('animals req.user:', animals);
    	cb(animals);    
    });

	//step2: component
    //step3: picture
    //step4: member_role
    //step5: office_role
	
	// var p = new picture({});
	// var mr = new member_role({});
	// var or = new office_role({});

	// async.waterfall([
 //        //step1: cases
 //        function(callback){
 //        	var c = new cases({});
 //        	c.getCases(function(error, result){
 //        		callback(null, result);
 //        	});
 //        }
 //        // ,
        
 //        // function (cases, callback) {
 //        // 	var cp = new component({});
 //        // 	cp.getEntityById(cases)
 //        // },

 //        // function (guid, callback) {
 //        // 	var data = {
 //        // 		users: req.body.users,
 //        // 		group_id: guid
 //        // 	};
 //        //     var ug = new user_group(data);
 //        //     ug.insert(function(error, result){
 //        //     	callback(null, result);	
 //        //     });
 //        // }
 //    ], function(error, result){
 //        console.log('error:', error);
 //        console.log('result1:', result);
 //        // res.json(error, result);
 //        cb(error, result);
 //    });
};

module.exports = cases_info;