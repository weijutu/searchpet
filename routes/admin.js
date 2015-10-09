var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/index');
});

router.get('/statistics', function(req, res, next) {
  res.render('admin/statistics');
});

router.get('/article', function(req, res, next) {
  res.render('admin/article');
});


module.exports = router;
