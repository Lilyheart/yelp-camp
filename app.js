//=========//
// Setup!  //
//=========//

var refreshSeeds = false;

var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
var app                   = express();

var Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    indexRoutes           = require("./routes/index"),
    campgroundRoutes      = require("./routes/campgrounds"),
    commentRoutes         = require("./routes/comments"),
    seedDB                = require("./seeds");
    
//Misc Setups

    app.use(express.static(__dirname + "/public"));
    app.set("view engine", "ejs");
    
    app.use(bodyParser.urlencoded({extended: true}));
    
    mongoose.connect("mongodb://localhost/yelp_camp");
    
// Passport Setups

    app.use(require("express-session")({
        secret: "2 people cannot keep a secret",
        resave: false,
        saveUninitialized: false
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    app.use(function(req, res, next){
        res.locals.currentUser = req.user;
        next();
    });

// Seed the database with fresh data

    if(refreshSeeds){seedDB()}
    
//=========//
// Routes! //
//=========//

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



//===========//
// Listener! //
//===========//

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started: " + process.env.IP + ":" + process.env.PORT);
});