var campground = require("../modules/campground"),
    comment = require("../modules/comment");

var middlewareObj = {};

middlewareObj.checkCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, function (err, checkComment) {
            if (err) {
                req.flash("error", "Campground not found!");
                res.redirect("back");
            } else {
                if (checkComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permissions to do that!")
                    res.redirect("back");
                }
            }
        })

    } else {
        req.flash("error", "You neeed to be logged in to do that!")
        res.redirect("back");
    }
};

middlewareObj.isLogeedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        //Execute the next of isLoggedIn
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}
middlewareObj.checkCampgroundOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        //Does the User own the Campground?

        campground.findById(req.params.id, function (err, foundcampground) {
            if (err) {
                res.redirect("back");
            } else {

                //if(campground.author.id == req.user.id )
                if (foundcampground.author.id.equals(req.user._id)) {
                    next();

                } else {
                    res.redirect("back");
                }
            }
        })
    } else {

        res.redirect("back");
    }

};

module.exports = middlewareObj;