var express = require('express');
var router = express.Router();

//
router.get('/', function(req, res, next) {
  res.render('animals/animals', { layout: 'layout.ejs', user: req.user});
});

//拾獲登入系統
router.get('/pickup', function(req, res, next) {
  res.render('animals/pickup', { user: req.user, title: '拾獲動物登錄' });
});

module.exports = router;
