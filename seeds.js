var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");

var campgroundData = [
    {  	"name" : "Salmons Creek",  
    	"image" : "https://farm6.staticflickr.com/5479/11694969344_42dff96680.jpg", 
    	"description" : "Great place to go fishing"
    },
    {  	"name" : "Granite Hills", 
    	"image" : "https://farm5.staticflickr.com/4103/5088123249_5f24c3202c.jpg", 
    	"description" : "It's just a hill.  Made of granite.  Nothing more!"
    },
    {  	"name" : "Wildwood Campground", 
    	"image" : "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg", 
    	"description" : "It's just a hill.  Made of granite.  Nothing more!"
    },
    { 	"name" : "Lake Fooey", 
    	"image" : "https://farm7.staticflickr.com/6138/6042439726_9efecf8348.jpg", 
    	"description" : "Hills and lakes"
    }
];

var commentData1 = [
    {  	"text": "This place is great",
        "author": "Homer"
    },
    {  	"text": ". . .",
        "author": "Maggie"
    },
    {  	"text": "*plays sax*",
        "author": "Lisa"
    },
    {  	"text": "Cowabunga",
        "author": "Bart"
    }
];

var commentData2 = [
    {  	"text": "Fish for dinner!",
        "author": "Marge"
    },
    {  	"text": "*falls on rock*",
        "author": "Grandpa Simpson"
    },
    {  	"text": "I found a bug!",
        "author": "Ralph"
    },
    {  	"text": "Too much water!",
        "author": "Apu"
    }
];

function seedDB(){
    Campground.remove({}, function(err, response){
        if (err) {
            console.log(err);
        } else {
            console.log("Removed campgrounds!");
            Comment.remove({}, function(err, response){
                if (err) {
                    console.log(err);
                } else {
                    campgroundData.forEach(function(seed, thisArg){
                        Campground.create(seed, function(err, campgroundResponse){
                            if (err) {
                                console.log(err);
                            } else {
                                Comment.create(commentData1[thisArg], function(err, comment){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        campgroundResponse.comments.push(comment);
                                    }
                                });
                                Comment.create(commentData2[thisArg], function(err, comment2){
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        campgroundResponse.comments.push(comment2);
                                        campgroundResponse.save();
                                    }
                                });
                            }
                        });
                        console.log("Added campground");
                    });
                }
            });
        }
    });
}

module.exports = seedDB;