var express = require('express');
var router = express.Router();
var member_role = require('../models/member_role.js');
var office_role = require('../models/office_role.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	var memberCount = 0;
	var mr = new member_role({});
	mr.getMembersAndRole(function(error, data){
		
		var r = data;
		console.log('data.rows:', data.rows);
		if (r.rows)
			memberCount =  data.rows.length;

		console.log('memberCoun1t:', memberCount);
		res.render('admin/overview', { 
	  		user: req.user, 
	  		layout: 'admin/layout/layout', 
	  		title: '總覽',
			subtitle: '',
			overview: {
				memberCount: memberCount || 0
			}
		});
	});
	
});

router.get('/users', function(req, res, next) {
	var mr = new member_role({});
	mr.getMembersAndRole(function(error, data){
		res.render('admin/users', { 
			user: req.user,
			users: data.rows, 
			layout: 'admin/layout/layout', 
			title: '會員列表',
			subtitle: '呈現所有的會員'
		});	
	});
});
router.get('/offices', function(req, res, next) {
	var or = new office_role({});
	or.getOfficesAndRole(function(error, data){
		res.render('admin/offices', { 
	  		user: req.user, 
	  		offices: data.rows,
	  		layout: 'admin/layout/layout', 
	  		title: '機關構列表',
			subtitle: '呈現所有的機關構' 
		});
	});
	
  
});


module.exports = router;
