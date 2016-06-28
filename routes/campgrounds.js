var express    = require("express");
var router     = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    middleware = require("../middleware");

// Campground INDEX

    router.get("/", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
    });
    
// Campground NEW
    
    router.get("/new", middleware.isLoggedIn, function(req, res){
        res.render("campgrounds/new");
    });
    
// Campground CREATE
    
    router.post("/", middleware.isLoggedIn, function(req, res){
        var name = req.body.name;
        var image = req.body.image;
        var desc = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        var newCampground = {name: name, image: image, description: desc, author:author};
        Campground.create(newCampground, function(err, newlyCreated){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/campgrounds/" + newlyCreated._id);
            }
        });
    });
    
// Campground SHOW
    
    router.get("/:campground_id", function(req,res){
        Campground.findById(req.params.campground_id).populate("comments").exec(function(err, foundCampground){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.render("campgrounds/show", {campground: foundCampground});
            }
        });
    });
    
// Campground EDIT
    
    router.get("/:campground_id/edit", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findById(req.params.campground_id, function(err, foundCampground){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.render("campgrounds/edit", {campground: foundCampground});
            }
        });
    });
    
// Campground UPDATE
    
    router.put("/:campground_id", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findByIdAndUpdate(req.params.campground_id, req.body.campground, function(err, updatedCampground){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/campgrounds/"+ req.params.campground_id);
            }
        });
    });
    
// Campground DESTROY
    
    router.delete("/:campground_id", middleware.checkCampgroundOwnership, function(req,res){
        Campground.findByIdAndRemove(req.params.campground_id, function(err, deletedCampground){
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/campgrounds");
            }
        });
    });
    
// Module Export
    
module.exports = router;