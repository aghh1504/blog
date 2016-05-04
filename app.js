var bodyParser          = require("body-parser"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    mongoose            = require("mongoose"),
    flash               = require("connect-flash"),
    express             = require("express"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    session             = require("express-session"),
    User                = require("./models/user"),
    Blog                = require("./models/blog"),
    Comment             = require("./models/comments"),
    Likes               = require("./models/likes"),
    Photo               = require("./models/photo"),
    app                 = express(),
    multer              = require('multer');
 
var commentRoutes    = require("./routes/comments"),
    blogRoutes       = require("./routes/blogs"),
    indexRoutes      = require("./routes/index"),
    uploadRoutes     = require("./routes/upload"),
    uploadsRoutes    = require("./routes/uploads"),
    settingRoutes    = require("./routes/setting"),
    likesRoutes      = require("./routes/likes");
    
var config = {
    port: process.env.PORT,
    ip: process.env.IP,
    connectionString: process.env.CONNECTION_STRING || "mongodb://localhost/restful_blog_app"
    }
//app config 
mongoose.connect(config.connectionString);
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());


var MongoStore = require("connect-mongo")(session);

//passport configuration
//dont logout when refresh by storing session in mongo db
app.use(session({
    secret: "holiday in nyc!!!!",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(
        {mongooseConnection:mongoose.connection},
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        })
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
     res.locals.success = req.flash("success");
    next();
});
app.use("/blogs/:id/comments", commentRoutes);
app.use("", blogRoutes);
app.use("", indexRoutes);
app.use("/upload",uploadRoutes);
app.use("/uploads",uploadsRoutes);
app.use("", settingRoutes),
app.use("/blogs/:id/likes", likesRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});

