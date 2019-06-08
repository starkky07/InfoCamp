const mongoose = require("mongoose");


//Schema Setup
var campgroundSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    description: String,
    location : String,
    lat : Number,
    lng : Number,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref :"User"
        },
        username : String
    },
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "comment"
        }
    ]
});
const Comment = require('./comment');
campgroundSchema.pre('remove', async function () {
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = mongoose.model("campground", campgroundSchema);

