var express     = require("express"),
    router       = express.Router({ mergeParams : true}),
    campground    = require("../modules/campground"),
    comment        = require("../modules/comment"),
    middleware      = require("../middleware");
//Creating a new comment in a campground
router.get("/new", middleware.isLogeedIn, function (req, res) {
    //params:campgrounds/id/comments/:comment_id
    campground.findById(req.params.id, function (err, fcampground) {
        if (err) {
            console.log(err);

        } else {
            res.render("comments/new", { campground: fcampground });
        }
    })

});

router.post("/", middleware.isLogeedIn, function (req, res) {
    campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Comment added successfuly. ")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});
//Edit Comments
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id : req.params.id, comment: foundComment });
        }
    })
})
//Updating the Comment
//It takes 3 params....1.data to find 2.Update with
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("Comment Updated")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    
})

router.delete("/:comment_id", middleware.checkCommentOwner, function (req, res) {
    comment.findByIdAndRemove(req.params.comment_id, function(err, delcomment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })


});
module.exports = router;