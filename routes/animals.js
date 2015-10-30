var express = require('express');
var router = express.Router();
var cases = require('../models/case.js');
var component = require('../models/component.js');
var picture = require('../models/picture.js');
var case_info = require('../models/case_info.js');


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

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


router.get('/detail', function(req, res, next) {
  res.render('animals/view', { user: req.user, title: '阿狗詳細資料', layout: 'layout/main' });
});

//拾獲登入系統
router.get('/pickup', isAuthenticated, function(req, res, next) {
  res.render('animals/pickup', { user: req.user, title: '拾獲動物登錄', layout: 'layout/main' });
});

module.exports = router;
