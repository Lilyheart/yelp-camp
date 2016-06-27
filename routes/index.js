var express  = require("express"),
    passport = require("passport");
var router   = express.Router();

var User     = require("../models/user");

// HOME

    router.get("/", function(req, res){
        res.render("landing");
    });
    
// Auth routes

    router.get("/register", function(req, res){
       res.render("register");
    });
    
    router.post("/register", function(req, res){
        console.log("New User!");
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

    router.get("/login", function(req, res){
        res.render("login");
    });
    
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});
    
    router.get("/logout", function(req, res){
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
    
module.exports = router;