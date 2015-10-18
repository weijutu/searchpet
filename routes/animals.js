var express = require('express');
var router = express.Router();

//尋找我的毛小孩
router.get('/', function(req, res, next) {
  res.render('animals/animals', { layout: 'layout.ejs', user: req.user });
});

router.get('/pickup', function(req, res, next) {
  res.render('animals/pickup', { layout: 'layout.ejs', user: req.user, title: '拾獲動物登錄' });
});


module.exports = router;