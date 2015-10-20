var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');



/* GET home page. */
router.get('/', function(req, res, next) {

	// oracle
	oracledb.getConnection({
	    user          : "group8", 
	    password      : "Eightgroupad",
	    connectString : "140.117.79.132:1521/pdb4"
	  },
	  function(err, connection) {
	  	console.log(connection);
	    if (err) { console.error(err.message);  }
	    connection.execute("select * from tbltest", [], function(err, result){
	    	console.log('conn db result:', result);
	    });
	    // connection.execute("SELECT 12 + 34 AS result", [],
	    //   function(err, result) {
	    //     if (err) { console.error(err.message); return; }
	    //     console.log(result.rows);
	    //   });
	});

  res.render('index', { title: 'Express', user: req.user });
});
router.get('/team', function(req, res, next) {
  res.render('team', { layout: 'layout.ejs', user: req.user });
});
// router.get('/animals', function(req, res, next) {
//   res.render('animals', { layout: 'layout.ejs', user: req.user });
// });

module.exports = router;
