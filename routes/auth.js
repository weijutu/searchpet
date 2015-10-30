var oracledb = require('oracledb');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var config = require('../settings/auth.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var member = require('../models/member.js');
var uuid = require('node-uuid');

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

//============登入==============
//登入頁面
router.get('/login', function(req, res, next) {
  console.log('get login:', req.success);
  res.render('auth/login', { user: req.user , layout: 'layout/basic'});
});

//登入頁面送出
router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
}));
// router.post('/login', function(req, res, next){
//   passport.authenticate('login', function(err, user, info){
//     console.log('login erro:', err);
//     console.log('login user:', user);
//     console.log('login info:', info);
//     if (err) { return next(err); }
//     if (!user) {
//       console.log('info:', info);
//       return res.redirect('/');
//       // return res.json(user);
//       // return res.render('auth/login', { user: user, success: false , layout: 'layout/basic'});
//       // return res.json(200, { user: user.id });
//     }
//     console.log('got user');
//     // return res.json(200, { user: user });
//     return res.redirect('/');
//   })(req, res, next);
// });

//===========註冊================
//註冊頁面
router.get('/register', function(req, res, next) {
  res.render('auth/register', { user: req.user, layout: 'layout/basic' });
});
//註冊頁面送出
router.post('/register', passport.authenticate('register', {
  successRedirect: '/animals/pickup',
  failureRedirect: '/auth/login'
}));


//刪除使用者
router.delete('/user', function(req, res, next){
  var m = new member({});
  var mId = req.body.mId;

  m.delete(mId, function(error, result){
    console.log("register error:", error);
    console.log("register result:", result);
    if (error) {
      res.json({ success: false });
    }
    res.json(result);
  });
});

//基本資料維護
router.get('/profile', isAuthenticated, function(req, res, next) {
  console.log('profile req.user:', req.user);
  res.render('auth/profile', { user: req.user, layout: 'layout/main', title: '基本資料維護' });
});

//登出頁面, 回到首頁
router.get('/logout', function(req, res) {
  console.log('logout');
  req.logout();
  res.redirect('/');
});

//註冊頁面 ok
// router.post('/register', function(req, res, next){
//     var body = req.body;
//     var user = {
//       m_id: uuid.v4(),
//       r_id: '437643b0-ac9e-41bc-abd1-3706b0642000',
//       account: body.account,
//       password: body.password,
//       name: body.name,
//       email: body.email,
//       telphone: body.telphone
//     };
//     console.log(user);
//     insertUser(user, function(err, user) {
//         var payload;
//         if (err) { return next(err); }
//         payload = {
//             sub: user.email,
//             telphone: user.telphone
//         };

//         res.status(200).json({
//             user: user,
//             token: jwt.sign(
//               payload, 
//               config.jwtSecretKey, 
//               { expiresInMinutes: 60 }
//             )
//         });
//     });
// });

passport.use('register', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        emailField : 'email',
        nameField : 'name',
        telphoneField : 'telphone',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        console.log('username passport:', username);
        console.log('password passport:', password);
        console.log('email passport:', req.body.email);
        console.log('name passport:', req.body.name);
        console.log('telphone passport:', req.body.telphone);
        process.nextTick(function() {
          var user = {
            m_id: uuid.v4(),
            r_id: '437643b0-ac9e-41bc-abd1-3706b0642000',
            username: username,
            password: password,
            email: req.body.email,
            name: req.body.name,
            telphone: req.body.telphone
          };
          
          console.log(user);
          insertUser(user, function(err, user) {
              var payload;
              if (err) { return next(err); }
              payload = {
                  sub: user.email,
                  telphone: user.telphone
              };

              // res.status(200).json({
              //     user: user,
              //     token: jwt.sign(
              //       payload, 
              //       config.jwtSecretKey, 
              //       { expiresInMinutes: 60 }
              //     )
              // });
              user.token = jwt.sign(
                payload, 
                config.jwtSecretKey, 
                { expiresInMinutes: 60 }
              );
              return done(null, user);
          });


           
        });

    })
);

passport.use('login', new LocalStrategy({ 
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback: true
  }, function(req, username, password, done){

    // console.log('passport username:', username);
    // console.log('passport password:', password);

    if (!req.body) return res.json({ isError: true, error: 'no data' });

    var username = req.body.username;
    var password = req.body.password;

    // console.log('req passport username:', username);
    // console.log('req passport password:', password);

    var user = {
      username: username,
      password: password
    };
    var m = new member({});
    m.getMemberByUsername(username, function(error, result){
      console.log('getMemberByUsername1 result1:', result.rows[0]);
      // console.log('getMemberByUsername error:', error);
      if (error) 
        return done(null, error);

      if (!result) 
        return done(null, error);

      return done(null, result.rows[0]);  

    });
    // return done(null, user);  
    
  }
));

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("session:" , user);
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


function insertUser(user, cb) {
  console.log('insertUser:' ,user);
    oracledb.getConnection(
        config.database,
        function(err, connection){
          console.log('insertUser error :', err);
            if (err) {
                return cb(err);
            }
          connection.execute(
              'insert into member ( ' +
              '   m_id, ' +
              '   r_id, ' +
              '   account, ' +
              '   password, ' +
              '   name, ' +
              '   email, ' +
              '   telphone ' +
              ') ' +
              'values (' +
              '    :m_id, ' +
              '    :r_id, ' +
              '    :account, ' +
              '    :password, ' +
              '    :name, ' +
              '    :email, ' +
              '    :telphone ' +
              ') ' +
              'returning ' +
              // '   mid, ' +
              '   email, ' +
              '   telphone ' +
              'into ' +
              // '   :rmid, ' +
              '   :remail, ' +
              '   :rtelphone',
              {
                  m_id: user.m_id,
                  r_id: user.r_id,
                  account: user.username,
                  password: user.password,
                  name: user.name,
                  email: user.email,
                  telphone: user.telphone,
                  // rmid: {
                  //   type: oracledb.STRING,
                  //   dir: oracledb.BIND_OUT
                  // },
                  remail: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                  },
                  rtelphone: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_OUT
                  }
              },
              { autoCommit: true },
              function(err, results){
                console.log('eeerrrr:', err);
                console.log('results:', results);
                  if (err) {
                    console.log('erroro:', err);
                      connection.release(function(err) {
                          if (err) {
                              console.error(err.message);
                          }
                      });
                      return cb(err);
                  }

                  cb(null, {
                      // mid: results.outBinds.rmid[0],
                      email: results.outBinds.remail[0],
                      telphone: results.outBinds.rtelphone[0]
                  });

                  connection.release(function(err) {
                      if (err) {
                          console.error(err.message);
                      }
                  });
              });
        }
    );
}

//=================不可以動
// router.post('/user', function(req, res, next){
// 	var user = {
//         email: req.body.email
//     };
//     console.log(user);
//     var unhashedPassword = req.body.password;
//     bcrypt.genSalt(10, function(err, salt) {
//         if (err) {
//             return next(err);
//         }
 
//         bcrypt.hash(unhashedPassword, salt, function(err, hash) {
//             if (err) {
//                 return next(err);
//             }
 
//             user.hashedPassword = hash;
 
//             insertUser(user, function(err, user) {
//                 var payload;
 
//                 if (err) {
//                     return next(err);
//                 }
 
//                 payload = {
//                     sub: user.email,
//                     role: user.role
//                 };
 
//                 res.status(200).json({
//                     user: user,
//                     token: jwt.sign(payload, config.jwtSecretKey, {expiresInMinutes: 60})
//                 });
//             });
//         });
//     });
// });

// function insertUser(user, cb) {
// 	console.log('insertUser:' ,user);
//     oracledb.getConnection(
//         config.database,
//         function(err, connection){
//         	console.log('insertUser error :', err);
//             if (err) {
//                 return cb(err);
//             }
//  			console.log('connection :', connection);
//             connection.execute(
//                 'insert into jsao_users ( ' +
//                 '   id, ' +
//                 '   email, ' +
//                 '   password, ' +
//                 '   role ' +
//                 ') ' +
//                 'values (' +
//                 '    1, ' +
//                 '    :email, ' +
//                 '    :password, ' +
//                 '    \'BASE\' ' +
//                 ') ' +
//                 'returning ' +
//                 '   id, ' +
//                 '   email, ' +
//                 '   role ' +
//                 'into ' +
//                 '   :rid, ' +
//                 '   :remail, ' +
//                 '   :rrole',
//                 {
//                     email: user.email.toLowerCase(),
//                     password: user.hashedPassword,
//                     rid: {
//                         type: oracledb.NUMBER,
//                         dir: oracledb.BIND_OUT
//                     },
//                     remail: {
//                         type: oracledb.STRING,
//                         dir: oracledb.BIND_OUT
//                     },
//                     rrole: {
//                         type: oracledb.STRING,
//                         dir: oracledb.BIND_OUT
//                     }
 
//                 },
//                 {
//                     autoCommit: true
//                 },
//                 function(err, results){
//                 	console.log('eeerrrr:', err);
//                 	console.log('results:', results);
//                     if (err) {
//                         connection.release(function(err) {
//                             if (err) {
//                                 console.error(err.message);
//                             }
//                         });
 
//                         return cb(err);
//                     }
 
//                     cb(null, {
//                         id: results.outBinds.rid[0],
//                         email: results.outBinds.remail[0],
//                         role: results.outBinds.rrole[0]
//                     });
 
//                     connection.release(function(err) {
//                         if (err) {
//                             console.error(err.message);
//                         }
//                     });
//                 });
//         }
//     );
// }


module.exports = router;
