var express = require("express");
var app = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");

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
app.get("/blogs/new",middleware.isLoggedIn, function(req, res) {
    res.render("new");
});

//Create route
app.post("/blogs",middleware.isLoggedIn, function(req, res){
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
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
       
      
           if(err){
            res.redirect("/blogs");
        }else{
            foundBlog.isEditable = (req.user && foundBlog.createdBy === req.user.username);
            console.log("foundBlog", foundBlog)
            console.log("req.user", req.user)
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
        } else if( req.user && foundBlog.createdBy !== req.user.username){
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
app.get("/my-blog", function(req, res) {
    Blog.find({ createdBy: req.user.username }, function(err, blogs) {
        if(err){
            console.error("error", err);
            res.send(err);
        }else{
             res.render("my-blog", {blogs: blogs}); 
        }
    });
  
});

// about
app.get("/about",middleware.isLoggedIn, function(req, res) {
    res.render("about");
});
//setting
 app.get("/setting",middleware.isLoggedIn,function(req, res) {
     res.render("setting",{ message: "" });
 });
 app.post("/setting",middleware.isLoggedIn, function(req, res) {
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

module.exports = app;