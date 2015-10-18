var express = require('express');
var router = express.Router();

//登入
router.get('/login', function(req, res, next) {
  res.render('auth/login', { user: req.user});
});

//註冊
router.get('/register', function(req, res, next) {
  res.render('auth/register', { user: req.user });
});

module.exports = router;
