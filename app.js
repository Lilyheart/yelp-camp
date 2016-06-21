// setup express, ejs, & mongoose

var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost/yelp_camp");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


// setup routes

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, image: image, description:description};
    
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/index");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.get("/campgrounds/:id", function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});


// setup listener

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp server has started: " + process.env.IP + ":" + process.env.PORT);
});