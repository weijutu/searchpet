var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var config = utils.getConfig();
var role = require('../models/role.js');
var member = require('../models/member.js');
var office = require('../models/office.js');
var cases = require('../models/case.js');
var component = require('../models/component.js');
var picture = require('../models/picture.js');
var opfn = require('../models/opfn.js');
var should   = require('should');

/* GET home page. */
router.get('/', function(req, res, next) {

	// oracle
	// oracledb.getConnection({
	//     user          : config.oracle.user, 
	//     password      : config.oracle.password,
	//     connectString : config.oracle.connectionstring
	//   },
	//   function(err, connection) {
	//   	console.log('connection:', connection);
	//     if (err) { console.error(err.message);  }

	//     connection.execute("select * from role where r_id= :role_id", 
	//     	{ role_id : '437643b0-ac9e-41bc-abd1-3706b0642000'
	//     }, 
	//     { outFormat: oracledb.OBJECT }
	//     ,function(err, result){
	//     	console.log('conn db result122:', result);
	//     });
	// });

	//role
	var r = new role({});
	// r.getEntityById('437643b0-ac9e-41bc-abd1-3706b0642000');
	// r.getRoles();
	// r.insertRoleById('');
	r.insertRoleById(function(data){
		console.log('client data:', data);
	});




	//member
	// var m = new member({});
	// m.getMembers();
	// m.getEntityById('d76b4f9f-61a9-4b44-819c-609456fc70c9');

	//office
	// var o = new office({});
	// o.getOffices();
	// o.getEntityById('3a564f04-7030-4bab-baa1-1120fe5e60d1');

	//cases
	// var c = new cases({});
	// c.getCases();
	// c.getEntityById('e043b666-de30-46a2-8ae0-bd7aef1f1ece');

	// var c = new component({});
	// c.getEntityById('e043b666-de30-46a2-8ae0-bd7aef1f1ece');

	// var p = new picture({});
	// p.getPictures();

	// var o = new opfn({});
	// o.getEntityById('437643b0-ac9e-41bc-abd1-3706b0642000');

  	res.render('index', { title: 'Express', user: req.user, layout: 'layout/index' });
});
router.get('/team', function(req, res, next) {
  res.render('team', { layout: 'layout.ejs', user: req.user, layout: 'layout/main' });
});
// router.get('/animals', function(req, res, next) {
//   res.render('animals', { layout: 'layout.ejs', user: req.user });
// });

module.exports = router;
