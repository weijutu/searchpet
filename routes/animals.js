var express = require('express');
var router = express.Router();
var cases = require('../models/case.js');
// var component = require('../models/component.js');
// var picture = require('../models/picture.js');
var case_info = require('../models/case_info.js');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};  

//拾獲登入系統
router.get('/pickup', function(req, res, next) {
  res.render('animals/pickup', { 
  	user: req.user, 
  	title: '拾獲動物登錄', 
  	layout: 'layout/main' 
  });
});
router.post('/pickup', upload.single('avatar'), function(req, res, next){
	console.log('req.files pickup:', req);
	var body = req.body;
	var p_id = "";
	var m_id = "";
	var o_id = "";
	var gender = body.gender;
	var variety = body.variety;
	var color = body.color;
	var haschip = body.haschip;
	var description = body.description;
	var back_status = "n";
	var owner_telphone = "";
	var owner_name = "";
	var pickuptime = body.pickuptime;
	var location = body.location;
	var sheltertime = body.sheltertime;
	var account = body.txtAccount;

	var c = new cases({});
	c.insert({}, function(error, result){
		if (error) {
			res.json({ success: false }); 
		}
		
	});

	res.json({ success: true });
});
//
// router.get('/', function(req, res, next) {
// 	var c = new cases({});
//     var animals; 
//     c.getCases(function(error, results){
//         animals = results;  
//         console.log('animals req.animals :', animals);
//         console.log('animals req.user:', req.user); 
//     	res.render('animals/animals', { layout: 'layout/main', user: req.user, animals: animals });
//     });
// });

router.get('/info/:id', function(req, res, next) {
	var id = req.param("id"); 
	console.log('info id:', id); 
	var ci = new case_info({}); 
	ci.getCasesById(id, function(error, result){
		// console.log('router err:', error);
		// console.log('router result:', result);
		if (error) {
			res.json({ success: false });
		}
		res.json(result);
	});
});

router.get('/detail/:id', function(req, res, next) {
	var id = req.param("id");
	console.log('id:', id); 
	var id = req.param("id"); 
	console.log('info id:', id); 
	var ci = new case_info({}); 
	ci.getCasesById(id, function(error, result){
		if (error) {
			res.json({ success: false });
		}
		var animals = result;
		// res.json(result);
		res.render('animals/view', { 
			user: req.user, 
			title: '阿狗詳細資料', 
			layout: 'layout/main',
			animals: animals 
		});
	});
  	
});


module.exports = router;
