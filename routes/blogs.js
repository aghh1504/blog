var express = require("express");
var app = express.Router();
var Blog = require("../models/blog");
var Like = require("../models/like");
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
            Like.findById(req.params.id).populate("likes").exec(function(err, likes){
                if(err){
                    res.redirect("/blogs")
                } else {
                foundBlog.isEditable = (req.user && foundBlog.createdBy === req.user.username);
            console.log("foundBlog", foundBlog)
            console.log("req.user", req.user)
            console.log("likes", likes)
            res.render("show", {blog: foundBlog, likes: likes});
                }
            });       
            
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
module.exports = app;