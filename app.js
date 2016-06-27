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
var app        = express();

var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
    
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

// HOME

    app.get("/", function(req, res){
        res.render("landing");
    });
    
// Campground INDEX

    app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
    });
    
// Campground NEW
    
    app.get("/campgrounds/new", isLoggedIn, function(req, res){
        res.render("campgrounds/new");
    });
    
// Campground CREATE
    
    app.post("/campgrounds", isLoggedIn, function(req, res){
        Campground.create(req.body.campground, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
    });
    
// Campground SHOW
    
    app.get("/campgrounds/:id", function(req,res){
        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
        });
    });
    
// Campground Comment NEW
    
    app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                console.log(err);
            } else {
                res.render("comments/new", {campground: foundCampground});
            }
        });
    });
    
// Campground Comment CREATE
    
    app.post("/campgrounds/:id/comments", isLoggedIn, function(req,res){
        Campground.findById(req.params.id, function(err, campground){
           if (err) {
                console.log(err);
                res.redirect("/campgrounds");
           } else {
                Comment.create(req.body.comment, function(err, comment){
                    if (err) {
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
           }
        });
    });
    
// Auth routes

    app.get("/register", function(req, res){
       res.render("register");
    });
    
    app.post("/register", function(req, res){
        var newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, function(err, user){
            if (err) {
                console.log(err);
                res.render("register");
            } else {
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/campgrounds");
                });
            }
        });
    });

// Login/Logout Routes

    app.get("/login", function(req, res){
        res.render("login");
    });
    
    app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});
    
    app.get("/logout", function(req, res){
        req.logout();
        res.redirect("/campgrounds");
    });

//=============//
// Middleware! //
//=============//

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login");
    }
}

//===========//
// Listener! //
//===========//

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started: " + process.env.IP + ":" + process.env.PORT);
});