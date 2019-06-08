var express = require("express"),
    router = express.Router({ mergeParams : true}),
    campground = require("./campgrounds"),
    Comment = require("./comments"),
    passport = require("passport"),
    User = require("../modules/user");


//Creating a new comment in a campground


router.get("/", function (req, res) {
    res.render("landing");
});



//------------------------------
//AUTH routes

//show signup form

router.get("/register", function (req, res) {
    res.render("register")
})

//handling user signup
router.post("/register", function (req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function () {
            req.flash("success","Welcome to Yelp Camp" + user.username);   
            res.redirect("/campgrounds");
            });
        }

    })
});

// router.get("/secret", isLogeedIn, function (req, res) {
//     res.render("secret");
// })


// Log in 
router.get("/login", function (req, res) {
    res.render("login");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureMessage: "Wrong username or password!"
}), function (req, res) {
        req.flash("success","Logged in as"+ user.username);
});

//log out

router.get("/logout", function (req, res) {
    req.logOut();
    req.flash("success", "You logged Out!")
    res.redirect("/");
})

module.exports = router;