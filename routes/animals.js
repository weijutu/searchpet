var express = require('express');
var router = express.Router();
var cases = require('../models/case.js');
var component = require('../models/component.js');
// var picture = require('../models/picture.js');
var case_info = require('../models/case_info.js');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var uuid = require('node-uuid');
var configAuth = require('../settings/auth.js');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
};  

router.get('/', function(req, res, next) {
    var animals; 
    console.log('animals req.user?:', req.session.user); 
    try {
    	var c = new cases({});
        c.getCases(function(error, results){
            console.log('animals list: ', error);
            animals = results;  
            console.log('animals req.animals :', animals);
            res.render('animals/animals', { 
                layout: 'layout/main', 
                animals: animals,
                //user: req.user
                user: req.session.user
            });
        });
    } catch(e) {
        console.log(e);
    }
});

//拾獲登入系統
router.get('/pickup', function(req, res, next) {
  res.render('animals/pickup', { 
  	//user: req.user, 
  	entity: null,
  	user: req.session.user, 
  	title: '拾獲動物登錄', 
  	layout: 'layout/main' 
  });
});
router.post('/update/:p_id', function(req, res, next){
	var p_id = req.param("p_id"); 
	console.log('update p_id:', p_id); 

	var body = req.body;
	//var o_id = "";
	var gender = body.gender;
	var variety = body.variety;
	var color = body.color;
	var haschip = (body.haschip == 'on') ? 1 : 0;
	var description = body.description;
	var back_status = "n";
	var owner_telephone = "111111";
	var owner_name = "2222222";
	var pickuptime = body.pickuptime;
	var location = body.location;
	var sheltertime = body.sheltertime;

	var entity = {
		p_id: p_id,
		//o_id: o_id,
		gender: gender,
		variety: variety,
		color: color,
		haschip: haschip,
		description: description,
		back_status: back_status,
		owner_telephone: owner_telephone,
		owner_name: owner_name,
		pickuptime: pickuptime,
		location: location,
		sheltertime: sheltertime 
	};
	var c = new cases({});
	c.update(entity, function(error, result){
		if (error) {
		  	console.log('update case error true');
		    //res.json({ success: false });
		} else {
		  	console.log('update case error false');
		  	var compEntity = {
				p_id: p_id,
				comp_type: body.comp_type,
				comp_color: body.comp_color,
				comp_remark: body.comp_remark,
				description: body.comp_description
			};
			entity.comp_type = body.comp_type;
			entity.comp_color = body.comp_color;
			entity.comp_remark = body.comp_remark;
			entity.comp_description = body.comp_description;
			var comp = new component({});
			comp.update(compEntity, function(error, result){
				if (error) {
				  	console.log('update component error true');
				    res.json({ success: false });
				} else {
				  	console.log('update component error false');
				  	//res.json(result);
				  	res.render('animals/pickup', { 
					  	//user: req.user, 
					  	entity: {
					  		p_id: body.p_id,
							//o_id: o_id,
							gender: body.gender,
							VARIETY: body.variety,
							COLOR: body.color,
							haschip: body.haschip,
							DESCRIPTION: body.description,
							back_status: body.back_status,
							owner_telephone: body.owner_telephone,
							owner_name: body.owner_name,
							pickuptime: body.pickuptime,
							LOCATION: body.location,
							sheltertime: body.sheltertime,
					  		comp_type: body.comp_type,
					  		comp_color: body.comp_color,
					  		comp_remark: body.comp_remark,
					  		comp_description: body.comp_description
					  	},
					  	user: req.session.user, 
					  	title: '拾獲動物登錄', 
					  	layout: 'layout/main' 
					});
				}
			});
		}
	});

	

	// res.render('animals/pickup', {
	//   	user: req.session.user, 
	//   	title: '拾獲動物登錄', 
	//   	layout: 'layout/main',
	//   	success: true
	//  });
});
router.get('/pickup/:p_id', function(req, res, next) {
  	var p_id = req.param("p_id"); 
	console.log('pickup p_id:', p_id); 
	var c = new cases({});
	
	c.getEntityById(p_id, function(error, result){
		console.log('pickup eneity id:', result);
		var r;
		if (result != null && result.length > 0) {
			r = result[0];
		}
		var comp = new component({});
		comp.getEntityById(p_id, function(comp_error, comp_result){
			console.log('getEntityById comp_error:', comp_error);
			console.log('getEntityById comp_result:', comp_result);
			if (comp_error) {

			}
			if (comp_result != null && comp_result.length > 0) {
				var rcomp = comp_result[0];
				r.comp_type = rcomp.COMP_TYPE || '';
				r.comp_color = rcomp.COMP_COLOR || '';
				r.comp_remark = rcomp.COMP_REMARK || '';
				r.comp_description = rcomp.DESCRIPTION || '';
			}
			console.log('/pickup/:p_id:', r);
			res.render('animals/pickup', { 
		  		//user: req.user, 
		  		entity: r,
		  		user: req.session.user, 
		  		title: '拾獲動物登錄', 
		  		layout: 'layout/main' 
		  	});
		});
	});
});

//刪除
router.delete('/pickup', function(req, res, next){
	var c = new cases({});
	var pId = req.body.pId;
	console.log('delete pId: ', pId);
	//res.json({ success: false });

	c.delete(pId, function(error, result){
	  console.log("delete case error:", error);
	  console.log("delete case result:", result);
	  if (error) {
	  	console.log('delete case error true');
	    //res.json({ success: false });
	  } else {
	  	console.log('delete case error false');
	  	//res.json(result);
	  }

	  var comp = new component({});
	  comp.delete(pId, function(error, result){
	  	if (error) {
		  	console.log('delete component error true');
		    res.json({ success: false });
		  } else {
		  	console.log('delete component error false');
		  	res.json(result);
		  }
	  });
	  
	});
});


router.post('/pickup', upload.single('avatar'), function(req, res, next){
	// console.log('req.files pickup:', req);
	//var user = req.session.user;
	var session = req.session;
	console.log('session user:', session);
	var user_id = "";
	if (session !== null) {
		var rows = session.user.rows;
		if (rows != null && rows.length > 0) {
			var row = rows[0];
			user_id = row.M_ID;
		}
		console.log('session row:', rows);
		console.log('user_id:', user_id);
	}
	var body = req.body;
	var p_id = uuid.v4();
	var m_id = user_id;
	var o_id = "";
	var gender = body.gender;
	var variety = body.variety;
	var color = body.color;
	var haschip = (body.haschip == 'on') ? 1 : 0;
	var description = body.description;
	var back_status = "n";
	var owner_telephone = "";
	var owner_name = "";
	var pickuptime = body.pickuptime;
	var location = body.location;
	var sheltertime = body.sheltertime;
	var account = body.txtAccount;

	var entity = {
		p_id: p_id,
		m_id: m_id,
		o_id: o_id,
		gender: gender,
		variety: variety,
		color: color,
		haschip: haschip,
		description: description,
		back_status: back_status,
		owner_telephone: owner_telephone,
		owner_name: owner_name,
		pickuptime: pickuptime,
		location: location,
		sheltertime: sheltertime 
	};

	var compEntity = {
		p_id: p_id,
		comp_type: body.comp_type,
		comp_color: body.comp_color,
		comp_remark: body.comp_remark,
		description: body.comp_description
	}
	console.log('pickup data:', entity);
	
	//案件
	var c = new cases({});
	c.insert(entity, function(error, result){
		if (error) {
			console.log('cases result:', error);
			//res.json({ success: false }); 
		}
	});
	//配件
	var comp = new component({});
	comp.insert(compEntity, function(error, result){
		if (error) {
			console.log('component result:', error);
			//res.json({ success: false }); 
		}
	});
	res.render('animals/pickup', {
	  	user: req.session.user, 
	  	title: '拾獲動物登錄', 
	  	layout: 'layout/main',
	  	success: true
	 });
	//res.json({ success: true });
	
});

router.get('/console', function(req, res, next){
    console.log('[console] req.session.user:', req.session.user);
   
	var session = req.session;
	var m_id = "";
	var animals;
	if (session) {
		var rows = session.user.rows;
		if (rows != null && rows.length > 0) {
			var row = rows[0];
			m_id = row.M_ID;
			console.log('[console] m_id:', m_id);
			var c = new cases({});
			c.getCasesByUserId(m_id,function(error, results){
	            console.log('animals list: ', error);
	            animals = results;  
	            console.log('animals req.animals :', animals);
				res.render('animals/console', { 
			        title: 'console', 
			        user: req.session.user, 
			        animals: animals,
			        layout: 'layout/main' 
			    });
			});
		}
	} else {
		console.log('asdfasdf');
	}
});

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
			//user: req.user, 
			user: req.session.user, 
			title: '阿狗詳細資料', 
			layout: 'layout/main',
			animals: animals 
		});
	});
  	
});


module.exports = router;
