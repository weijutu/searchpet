var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var cases = require('../models/case.js');
var component = require('../models/component.js');
var picture = require('../models/picture.js');
var member_role = require('../models/member_role.js');
var office_role = require('../models/office_role.js');
var async = require('async');
var _ = require("underscore");

function cases_info(c){

}

cases_info.prototype.getCasesById = function(id, cb){
	var ci_id = id;
	console.log('ci_id:', ci_id);	
	try {
		async.waterfall([ 
	        //step1: cases
	        function(next){ 
	        	var c = new cases({});
			    c.getEntityById(ci_id, function(error, results){
			        console.log('animals req.user:', results);
			    	next(null, results);      
			    });
	        },
	        //step2: component
	        function(results, next){
	        	var r = results[0];
	        	var cp = new component({});
				cp.getEntityById(ci_id, function(error, result){
        			var components = result;
        			r.components = components;
	        		console.log('component result:', r);
	        		next(null, r);
	        	});
	        },
	        // step3: picture 
	        function(results, next){
	        	var r = results;
	        	var p = new picture({});
	        	p.getEntityById(ci_id, function(error, result){
	        		var pictures = result;
	        		r.pictures = pictures;
	        		console.log('picture result:', r);
	        		next(null, r);
	        	});
	        },
	        //step4: member_role
	        function(results, next){
	        	var r = results;
	        	var mr = new member_role({});
	        	mr.getMembersAndRoleByMid(r.M_ID, function(error, result){
	        		var member = result;
	        		r.member = member.rows[0];
	        		console.log('member result:', r);
	        		next(null, r);
	        	});
	        },
	        //step5: office_role
	        function(results, next) {
	        	var r = results;
	        	var or = new office_role({});
	        	or.getOfficesAndRoleByOid(r.O_ID, function(error, result){
	        		var office = result;
	        		r.office = office.rows[0];
	        		console.log('office result:', r);
	        		next(null, r);
	        	});
	        }
	    ], function(error, result){
	        // console.log('error:', error);
	        console.log('result2:', result);
	        // res.json(error, result);
	        cb(error, result);
	    });
	} catch (e) {
		console.log(e);
	}
	
};

cases_info.prototype.getCases = function(id, cb){
	var ci_id = id;
	console.log('ci_id:', ci_id);

	//step2: component
    //step3: picture
    //step4: member_role
    //step5: office_role
	
	// var p = new picture({});
	// var mr = new member_role({});
	// var or = new office_role({});

	async.waterfall([
        //step1: cases
        function(next){
        	var c = new cases({});
		    c.getEntityById(ci_id, function(error, results){
		        // animals = results;
		        console.log('animals req.user:', results);
		    	next(null, results);      
		    });
        },
        function(result, next){
        	console.log('result:', result);
        	next(null, result);
        }
    ], function(error, result){
        console.log('error:', error);
        console.log('result1:', result);
        // res.json(error, result);
        cb(error, result);
    });
};

module.exports = cases_info;