var mongoose = require("mongoose");
var campground = require("./modules/campground");
var comment = require("./modules/comment");
var data = [
    {
        name: "Tso Moriri Lake",
        Loc: "Ladakh",
        image: "https://www.holidify.com/images/cmsuploads/compressed/640px-Tsomoriri_Lake_DSC4010_20190212171119.jpg",
        description: "Tsomoriri Lake is the highest lake in the world and located in Ladakh. Camping here is the experience of a lifetime. The lake is completely frozen during the winters and is an excitingly unique thing to witness. The best time to camp here is during May to September and it is simply wonderful to spend time in the decorated tents. You can trek in the nearby Ladakh region and witness the mesmerizing sunset at the lake. The best part is that the tents are comfortable with electricity supply."
    },
    {
        name: "Sangla Valley Camping", 
        Loc: " Sangla", 
        image: "https://www.holidify.com/images/cmsuploads/compressed/Sangla_valley_03_20190214130336jpg",
        description: "Sangla valley is an alluring valley in the Trans-Himalayan region and is a hotspot for tourists. It is a sought after place during the summers when the valley comes alive with tourists visiting from all parts of the world. Hidden away in the Himalayan region this is one picturesque valley which is untouched by the pollution of the big cities. There is a place called Kaza nearby which is the adventure hub of this place. Blending the culture and adventure, this camping site is perfect for travel enthusiasts."
    },
    {
        name: "Camp Exotica",
        Loc: " Kullu",
        image: "https://www.holidify.com/images/cmsuploads/compressed/tent-1208201_1920_20190212172038.jpg",
        description: "The Camp Exotica is a perfect weekend getaway option located in Kullu in the Manali district of Himachal Pradesh. The accommodation provided is world class and the tents simply leave you connecting with nature like never before. The location of these tents is such that it gives a panoramic view of the surrounding mountains. The food provided is of fine quality and the incredible view will simply leave you in awe of this adventure. Make sure to take out time for this pleasure full camping trip."
    }
]
function seedDB() {
    //Remove all campgrounds
    campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed campgrounds!");
        comment.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed comments!");
            //add a few campgrounds
            data.forEach(function (seed) {
                campground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        
                        console.log("added a campground");
                       
                        comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Stark"
                            }, function (err, comment) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    

                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
     });
    // //add a few comments
}

module.exports = seedDB;

