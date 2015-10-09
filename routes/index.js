var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/team', function(req, res, next) {
  res.render('team', { layout: 'layout.ejs' });
});

module.exports = router;
