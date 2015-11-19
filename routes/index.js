var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var utils = require('../settings/utils.js');
var auth = require('../settings/auth.js');
var config = utils.getConfig();
var role = require('../models/role.js');
var member = require('../models/member.js');
var office = require('../models/office.js');
var opfn = require('../models/opfn.js');
var jwt = require('jsonwebtoken');
var cases = require('../models/case.js');
var picture =  require('../models/picture.js');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/* GET home page. */
router.get('/', function(req, res, next) {
    // console.log('req.body home:', req.user);
    console.log('[index] req.session.user:', req.session.user);
  	res.render('index', { 
        title: 'index', 
        user: req.session.user, 
        layout: 'layout/index' 
    });
});

router.get('/picture', function(req, res, next) {
    // console.log('req.body home:', req.user);
    var p = new picture({});
    p.read("e043b666-de30-46a2-8ae0-bd7aef1f1ece", function(error, result){
        console.log('result:', result);
        res.json({ success: true });
    });
    
});

//待確認
router.post('/picture', function(req, res, next) {
    // console.log('req.body home:', req.user);
    var p = new picture({});
    p.insert(null, function(error, result){
        console.log('result:', result);
        res.json({ success: true });
    });
    
});

router.get('/animals', function(req, res, next) {
    var c = new cases({});
    var animals; 
    console.log('animals req.user?:', req.user); 
    c.getCases(function(error, results){
        animals = results;  
        console.log('animals req.animals :', animals);
        res.render('animals/animals', { 
            layout: 'layout/main', 
            animals: animals,
            user: req.user
        });
    }); 
});

//團隊 
router.get('/team', function(req, res, next) {
    res.render('team', {  
        // layout: 'layout.ejs', 
        user: req.user, 
        layout: 'layout/main' 
    });
});

router.get('/test', function(req, res, next){
    var c = new cases({});
    var animals;
    c.getCases(function(error, results){
        // console.log('animals result:', results);
        animals = results;
        console.log('animals req.user:', animals);
        res.json(animals);
    });
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

// router.get('/public_things', function(req, res, next){
// 	oracledb.getConnection(
//         auth.database,
//         function(err, connection){
//             if (err) {
//             	console.log(err);
//                 return next(err);
//             }
//             connection.execute(
//                 'select * from MEMBER ',
//                 {},//no binds
//                 {
//                     outFormat: oracledb.OBJECT
//                 },
//                 function(err, results){
//                 	console.log('err:', err);
//                 	console.log('results:',results);
//                     if (err) {
//                         connection.release(function(err) {
//                             if (err) {
//                                 console.error(err.message);
//                             }
//                         });
  
//                         return next(err);
//                     }
 
//                     res.status(200).json(results.rows);
 
//                     connection.release(function(err) {
//                         if (err) {
//                             console.error(err.message);
//                         }
//                     });
//                 });
//         }
//     );
// });

// router.get('/protected_things', function(req, res, next){
// 	var token;
//     var payload;
 
//     if (!req.headers.authorization) {
//         return res.status(401).send({message: 'You are not authorized'});
//     }
 
//     token = req.headers.authorization.split(' ')[1];
 
//     try {
//         payload = jwt.verify(token, config.jwtSecretKey);
//     } catch (e) {
//         if (e.name === 'TokenExpiredError') {
//             res.status(401).send({message: 'Token Expired'});
//         } else {
//             res.status(401).send({message: 'Authentication failed'});
//         }
 
//         return;
//     }
 
//     oracledb.getConnection(
//         config.database,
//         function(err, connection){
//             if (err) {
//                 return next(err);
//             }
 
//             connection.execute(
//                 'select * from MEMBER ',
//                 {},//no binds
//                 {
//                     outFormat: oracledb.OBJECT
//                 },
//                 function(err, results){
//                     if (err) {
//                         connection.release(function(err) {
//                             if (err) {
//                                 console.error(err.message);
//                             }
//                         });
 
//                         return next(err);
//                     }
 
//                     res.status(200).json(results.rows);
 
//                     connection.release(function(err) {
//                         if (err) {
//                             console.error(err.message);
//                         }
//                     });
//                 }
//             );
//         }
//     );
// });

module.exports = router;
