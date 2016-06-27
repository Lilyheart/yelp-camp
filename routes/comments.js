var express    = require("express");
var router     = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    Comment    = require("../models/comment");

// Campground Comment NEW
    
    router.get("/new", isLoggedIn, function(req,res){
        Campground.findById(req.params.id, function(err, foundCampground){
            if (err) {
                console.log(err);
            } else {
                res.render("comments/new", {campground: foundCampground});
            }
        });
    });
    
// Campground Comment CREATE
    
    router.post("/", isLoggedIn, function(req,res){
        Campground.findById(req.params.id, function(err, campground){
            if (err) {
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                Comment.create(req.body.comment, function(err, comment){
                    if (err) {
                        console.log(err);
                    } else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        campground.comments.push(comment);
                        campground.save();
                        res.redirect("/campgrounds/" + campground._id);
                    }
                });
            }
        });
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