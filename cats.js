const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cat_app", { useNewUrlParser: true });

var catSchema = new mongoose.Schema({
    name : String,
    age : Number,
    temperament : String
});

var Cat = mongoose.model("cat", catSchema);
 
Cat.create({
    name : "Snow White",
    age : 9,
    temperament : "Evil",
}, function(err,cat){
        if (err) {
            console.log("Something Went Wrong!!");
        } else {
            console.log("We Just Saved A Cat To The DB:");
            console.log(cat);
        }
});

Cat.find({}, function(err, cats){
    if (err) {
        console.log("Error!");
        console.log(err);
    } else {
        console.log("We Just Saved A Cat To The DB:");
        console.log(cats  );
    }
});