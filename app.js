var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var passport = require('passport');
var session = require('express-session');
var FacebookStrategy = require('passport-facebook').Strategy;

var index = require('./routes/index');

try {var auth = require('./auth.js');} catch (err) { console.log('Running in production!');  }

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || auth.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET || auth.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL || auth.FACEBOOK_APP_CALLBACK_URL
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}
));

var app =  express();

app.set("port", process.env.PORT || 3000);
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

app.get('/', index.home);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d"), app.get("port"));
  console.log("  Press CTRL-C to stop\n");
});

module.exports = app;