var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../settings/auth.js');

//登入
router.get('/login', function(req, res, next) {
  res.render('auth/login', { user: req.user , layout: 'layout/basic'});
});

//註冊
router.get('/register', function(req, res, next) {
  res.render('auth/register', { user: req.user, layout: 'layout/basic' });
});

//基本資料維護
router.get('/profile', function(req, res, next) {
  res.render('auth/profile', { user: req.user, title: '基本資料維護' });
});



module.exports = router;
