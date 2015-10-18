var express = require('express');
var router = express.Router();

//首頁
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});
//關於我們團隊
router.get('/team', function(req, res, next) {
  res.render('team', { layout: 'layout.ejs', user: req.user });
});

module.exports = router;
