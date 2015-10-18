var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});
router.get('/team', function(req, res, next) {
  res.render('team', { layout: 'layout.ejs', user: req.user });
});
// router.get('/animals', function(req, res, next) {
//   res.render('animals', { layout: 'layout.ejs', user: req.user });
// });

module.exports = router;
