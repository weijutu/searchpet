var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./settings/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var animals = require('./routes/animals');
var upload = require('./routes/upload');
var utils = require('./settings/utils.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
//http://localhost:3000/auth/facebook/callback?code=AQCje8XrM6UVW9M93bWZ7ft0PYDl9AqsqQc8vTbQt_PizWBn3uPqanotaUgAh0F9_bF8zW5KoTQwxfSJApNyUTDMBFse-KfjbBIuBYj86KwFI6WfgZ7IZADcntYq4u7AmmvZQq1_nFI4kW7y3DpxSCa2KsgT72fWZFmO3hyACf0EIGY7hG23wtAvFoFdD7qgYBwXu-pp_5Y8FekI-_4FVa1dK58kz0rbPFvCzfZXdObpkEEK-fku5LapUt8Wc1wq0Bx9fgq6IvL4pD39zmmghs1kKBODvhMoUNnlxpx4ze6vCwRuOD6JqpDQumFXQ3VEvy4ftW2XdCF1MKe_-pzWUMP2#_=_
app.use(function(req, res, next){
  var config = utils.getConfig();
  res.locals = {
    session: req.session
  };
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'search pet', key: 'spKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  var config = utils.getConfig();
  res.locals = {
    appName: config.app.name
  };
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/animals', animals);
app.use('/fileupload', upload);

passport.use(new FacebookStrategy({
      clientID: config.facebookAuth.facebook_api_key,
      clientSecret:config.facebookAuth.facebook_api_secret ,
      callbackURL: config.facebookAuth.callback_url
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        //Check whether the User exists or not using profile.id
        if(config.use_database==='true') {
           //Further code of Database.
        }
        return done(null, profile);
      });
    }
  ));

//Passport Router
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { 
       successRedirect : '/auth/profile', 
       failureRedirect: '/auth/login' 
  }),
  function(req, res) {
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
   console.log('serializeUser: ', user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log('deserializeUser: ', obj);
  done(null, obj);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
 
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
