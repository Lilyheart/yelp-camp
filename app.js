// setup express, ejs, & mongoose

var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

var Campground = require("./models/campground.js"),
    Comment    = require("./models/comment"),
    seedDB     = require("./seeds");

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/yelp_camp");

// Seed the database with fresh data

// seedDB();

// setup routes

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    Campground.create(req.body.campground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req,res){
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


// setup listener

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started: " + process.env.IP + ":" + process.env.PORT);
});