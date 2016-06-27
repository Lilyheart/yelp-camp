var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");

var campgroundData = [
    {  	"name" : "Salmons Creek",  
    	"image" : "https://farm6.staticflickr.com/5479/11694969344_42dff96680.jpg", 
    	"description" : "Great place to go fishin' Bacon ipsum dolor amet kielbasa cow prosciutto, sirloin picanha pancetta frankfurter shankle bresaola pig brisket fatback. Swine corned beef pork chop pastrami bresaola andouille shoulder t-bone frankfurter jerky. Short loin flank frankfurter cupim, tongue pig turkey ribeye. Alcatra bresaola rump pancetta ball tip pastrami short ribs pork loin pig turkey short loin shank ground round t-bone strip steak."
    },
    {  	"name" : "Granite Hills", 
    	"image" : "https://farm5.staticflickr.com/4103/5088123249_5f24c3202c.jpg", 
    	"description" : "It's just a hill.  Made of granite.  Nothing more! Cow doner tongue short ribs, strip steak beef ribs salami pork loin jowl porchetta meatloaf shankle hamburger picanha pork. Leberkas doner swine jerky. Sirloin pork belly pork loin sausage corned beef kevin alcatra pig strip steak chicken drumstick boudin shankle biltong. Kevin beef biltong brisket picanha pancetta. Bresaola spare ribs pancetta, shankle beef ribs kielbasa andouille shoulder meatball t-bone pastrami doner tri-tip."
    },
    {  	"name" : "Wildwood Campground", 
    	"image" : "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg", 
    	"description" : "All campsites.  All the time.Short ribs pastrami drumstick, cupim tail sausage shoulder. Ham hock hamburger corned beef shank, swine pancetta pastrami ham filet mignon sirloin. Bacon picanha beef ribs, tongue alcatra short loin flank. Spare ribs meatball tri-tip, cupim beef jowl brisket hamburger turkey shoulder. Prosciutto meatball biltong flank pancetta andouille pastrami tri-tip tongue alcatra."
    },
    { 	"name" : "Lake Fooey", 
    	"image" : "https://farm7.staticflickr.com/6138/6042439726_9efecf8348.jpg", 
    	"description" : "Hills and lakes and lakes and hills.  Pork ribeye pork chop turducken, pork loin landjaeger shankle t-bone ball tip. Beef ribs short loin meatball, ham hock pork flank drumstick ground round sirloin. Leberkas pork chop chuck, alcatra sirloin biltong hamburger pork prosciutto bresaola swine salami pig andouille. Prosciutto landjaeger chuck, andouille tri-tip brisket kevin sirloin turducken ham. Rump capicola prosciutto, short ribs porchetta pork belly shoulder pork tri-tip. Jowl pork chop jerky, ham capicola t-bone venison ham hock corned beef."
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
    User.remove({}, function(err, response){
        if (err) {
            console.log(err);
        } else {
            console.log("User database cleared")
        }
    });

}

module.exports = seedDB;