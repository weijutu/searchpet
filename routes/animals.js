var express = require('express');
var router = express.Router();

//
router.get('/', function(req, res, next) {
  res.render('animals/animals', { layout: 'layout.ejs', user: req.user});
});


router.get('/detail', function(req, res, next) {
  res.render('animals/view', { user: req.user, title: '阿狗詳細資料' });
});

//拾獲登入系統
router.get('/pickup', function(req, res, next) {
  res.render('animals/pickup', { user: req.user, title: '拾獲動物登錄' });
});

module.exports = router;