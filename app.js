// =========//
// Setup!  //
// =========//

var reseedDatabase = false;

var express = require('express'),
  bodyParser = require('body-parser'),
  flash = require('connect-flash'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  passport = require('passport'),
  LocalStrategy = require('passport-local');
var app = express();

var User = require('./models/user'),
  indexRoutes = require('./routes/index'),
  campgroundRoutes = require('./routes/campgrounds'),
  commentRoutes = require('./routes/comments'),
  seedDB = require('./seeds');

// Misc Setups

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());
app.set('view engine', 'ejs');

// Backup variables in the event of environment variable issues.  See README
var databaseURL = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
var sessionSecret = process.env.SESSION_SECRET || 'This is a backup secret';

mongoose.connect(databaseURL);

// Passport Setups

app.use(require('express-session')({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass information to all pages

app.use(function(req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.currentUser = req.user;
  next();
});

// Seed the database with fresh data

if (reseedDatabase) {
  seedDB();
}


// =========//
// Routes! //
// =========//

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:campground_id/comments', commentRoutes);


// ===========//
// Listener! //
// ===========//

app.listen(process.env.PORT, process.env.IP, function() {
  var appConsoleMsg = 'YelpCamp server has started: ';
  appConsoleMsg += process.env.IP + ':' + process.env.PORT;
  console.log(appConsoleMsg);
});
