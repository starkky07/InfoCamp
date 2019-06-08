var express = require("express"),
    router = express.Router({ mergeParams : true}),
    campground = require("../modules/campground"),
    comment = require("../modules/comment"),
    middleware = require("../middleware");
    NodeGeocoder = require("node-geocoder")

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);
//Index show all campgrounds
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    
    campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log("Something Went Wrong!!");
        } else {
            res.render("campgrounds/campgrounds", { Campgrounds: allCampgrounds });
        }
    });
});
router.post("/", middleware.isLogeedIn, function (req, res) {
    
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = { name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
     campground.create(newCampground, function (err, campground) {
        if (err) {
            console.log("Something Went Wrong!!", err);
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
     })

    })

});
// //CREATE - add new campground to DB
// router.post("/", middleware.isLoggedIn, function(req, res){
//   // get data from form and add to campgrounds array
//   var name = req.body.name;
//   var image = req.body.image;
//   var desc = req.body.description;
//   var author = {
//       id: req.user._id,
//       username: req.user.username
//   }
//     geocoder.geocode(req.body.location, function (err, data) {
//     if (err || !data.length) {
//       req.flash('error', 'Invalid address');
//       return res.redirect('back');
//     }
//     var lat = data[0].latitude;
//     var lng = data[0].longitude;
//     var location = data[0].formattedAddress;
//     var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
//     // Create a new campground and save to DB
//     campground.create(newCampground, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to campgrounds page
//             console.log(newlyCreated);
//             res.redirect("/campgrounds");
//         }
//     });
//   });
// });

router.get("/new", middleware.isLogeedIn, function (req, res) {
    res.render("campgrounds/new");
});
//Show every campground
router.get("/:id", function (req, res) {
    
    campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });

});
//Edit Routes
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    

        campground.findById(req.params.id, function (err, foundcampground) {
            res.render("campgrounds/edit", {
                campground: foundcampground
            });
        })
    
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwner, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;

        campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
            if (err) {
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                req.flash("success", "Successfully Updated!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});
//Destroy the route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    campground.findByIdAndDelete(req.params.id, function(err, DelCampground){
        if (err) {
            res.redirect("/campgrounds");
        } else {
                comment.deleteMany({
                            _id: {
                                $in: DelCampground.comments
                                 }}, function(err){
                                        if(err){
                                            console.log(err);
                                        }
                                        req.flash("success","Campground deleted!")
                                        res.redirect("/campgrounds");
                                    })
                 }
    })
});


module.exports = router;