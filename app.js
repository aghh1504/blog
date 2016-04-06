var bodyParser  = require("body-parser"),
    methodOverride  = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    session      = require("express-session"),
    User        = require("./models/user"),
    Blog       = require("./models/blog"),
    app             = express();
//app config 
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


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
    
    next();
});

//RESTFUL ROUTES


app.get("/", function(req, res) {
    res.render("landing");
});
// Index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
            //res.render("error", {})
        }else{
            console.log("blogs", blogs);
            res.render("index", {blogs: blogs});
        }
    });
});

//New route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});


//Create route
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    req.body.blog.createdBy = req.user.username;
    console.log(req.body.blog);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
       
      if( User){
          res.render("show", {blog: foundBlog});
          
      }
          else if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
    
});
 //edit route
 app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog) {
         if(err){
             res.redirect("/blogs")
         }else{
             res.render("edit", {blog: foundBlog});
         }
     })
     
 });

//update route
app.put("/blogs/:id", function(req, res) {
     req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log("req.body.blog = ", req.body.blog );
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.send("something goes wrong " + err)
        } else if(foundBlog.createdBy !== req.user.username){
            res.send("You not allow to edit this");
        }else {
            
           Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                res.redirect("/blogs/" + req.params.id);
            }
            
        });
        }
    });
});

//delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
   if(err){
       res.redirect("/blogs");
   } else {
       res.redirect("/blogs");
   }
    });
});
//add-photo
app.get("/blogs/:id/add-photo", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog) {
         if(err){
             res.redirect("/blogs")
         }else{
             res.render("add-photo", {blog: foundBlog});
         }
     })
     
 });
 
 //create submit button
 app.put("/blogs/:id/add-photo", function(req, res) {
     console.log(req.body.blog);
     
     
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.send(err);
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.get("/login", function(req, res) {
    res.render("login"); 
});
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), function(req, res) {
});
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, photo: req.body.photo});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/blogs");
        });
    });
});

//my-blog
app.get("/my-blog", function(req, res) {
   res.render("my-blog"); 
});

// about
app.get("/about", function(req, res) {
    res.render("about");
});
//setting
 app.get("/setting",function(req, res) {
     res.render("setting",{ message: "" });
 });
 app.post("/setting", function(req, res) {
     console.log('hello');
     // create variable to store
     var description = req.body.description;
     
     var user = req.user;
     console.log(req.user);
     //var connected with user
    user.description = description ;
    
    user.save(function(err){
        if(err){
            res.render("setting", { message: "Failed to save" });
            return;
        }
        req.login(user, function(err){
            if(err){
                res.render("setting", { message: "Failed to update profile" });
                return;
            }
              res.redirect("about" );
        });
    });
     
 });

// logic route logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/blogs");
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is running!");
});
