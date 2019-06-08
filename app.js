//For Environmetal Vars
require("dotenv").config()
var   express    = require("express"), 
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      methodOverride = require("method-override"),
      seedDB       = require("./seeds"),
      passport      = require("passport"),
      User           = require("./modules/user"),
      LocalStrategy     = require("passport-local"),
      passportLocalMongoose = require("passport-local-mongoose"),
      flash                 = require("connect-flash");
//---------Requiring the Routes---------

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
//------------------------------------------

//connecting to mongoose
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true }); 
//body parsing
app.use(bodyParser.urlencoded({extended : true}));
//We don't need to write ejs extension at the end of file 
app.set("view engine", "ejs");
//calling seedDB
//seedDB();
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());


//------------------------
//PASSPORT configuration
app.use(require("express-session")({
    secret: "You are the one who decides your future",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// campground.create(
//     {
//         name: "Camp Room on the Roof",
//         Loc: "Dehradun",
//         image: "https://www.holidify.com/images/cmsuploads/compressed/3473170977_c73bf27a6f_z_20190212173011.jpg",    
//         description: "Camp Room on the Roof is a beautiful place in Kerala which is a favourite among travel enthusiasts. The Seagot Camp is built on the largest Earth dam in India, the Banasura Dam. This alone makes it a unique place to visit. Surrounded by the tropical rainforest, camping in the splendid Wayanad region is an experience of a lifetime. It is a perfect place for the adventure lovers with a host of activities like trekking, angling, swimming, team building, and open-air barbecue."
//     }, function (err, campground) {
//         if (err) {
//             console.log("Something Went Wrong!!");
//         } else {
//             console.log("Newly Created Campground!");
//             console.log(campground);
//         }
//     }
// );
// To call this function on every wrap we will use app.use
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",indexRoutes);

app.listen(8080, function(){
    console.log("The Yelp Camp Server has Started!!");
});