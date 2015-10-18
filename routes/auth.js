var express = require('express');
var router = express.Router();

//登入頁面
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

//註冊頁面
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

//基本資料維護
router.get('/profile', ensureAuthenticated, function(req, res){
  console.log('req.user:', req.user);
  res.render('auth/profile', { user: req.user });
});

//登出
router.get('/logout', function(req, res){
  console.log('req.user logout:', req.user);
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
	console.log('req.isAuthenticated:', req.isAuthenticated);
  	if (req.isAuthenticated()) { 
  		return next(); 
  	}
  	res.redirect('/auth/login');
}

module.exports = router;
