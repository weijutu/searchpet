var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./settings/auth.js');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var admin = require('./routes/admin');
var animals = require('./routes/animals');
var utils = require('./settings/utils.js');
var setting = utils.getConfig();

var app = express();

// var httpServer = http.Server(app);
// httpServer.listen(setting.app.port, function(){
//     console.log("server listening on port", setting.app.port);
// });

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

// app.use(session({
//     secret: 'searchpet@isgood', 
//     saveUninitialized: true, 
//     resave: true})
// );
app.use(function(req, res, next){
  var config = utils.getConfig();
  res.locals = {
    session: req.session
  };
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({ 
    secret: 'searchpet',
    cookie: {maxAge: 1000 * 60 * 5},
    resave: false,
    saveUninitialized: true
}));
// app.use(express.methodOverride());
// app.use(express.multipart());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
  var config = utils.getConfig();
  res.locals = {
    appName: config.app.name
  };
  next();
});
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/animals', animals);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('找不到檔案');
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



//Passport Router
// app.get('/auth/facebook', passport.authenticate('facebook'));
// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { 
//        successRedirect : '/', 
//        failureRedirect: '/auth/login' 
//   }),
//   function(req, res) {
//     res.redirect('/');
//   });
// app.get('/auth/logout', function(req, res){
//   req.logout();
//   res.redirect('/');
// });
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/auth/login');
// }

// Use the FacebookStrategy within Passport.
// passport.use(new FacebookStrategy({
//     clientID: config.facebookAuth.facebook_api_key,
//     clientSecret:config.facebookAuth.facebook_api_secret ,
//     callbackURL: config.facebookAuth.callback_url
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log('fb accessToken:', accessToken);
//     process.nextTick(function () {
//       return done(null, profile);
//     });
//   }
// ));

module.exports = app;
