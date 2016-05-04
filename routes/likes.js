var express = require("express");
var app = express.Router({mergeParams: true}); 
var Blog = require("../models/blog");
var likes = require("../models/likes");
var middleware = require("../middleware");
  
  

//likes post
app.post("/",middleware.isLoggedIn,function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            console.log(blog.likes)
            if(blog.likes === undefined) {
              blog.likes = 0;
            }
            likes.create(req.body.likes, function(err, likes) {
                if(err){
                     req.flash("error", "Somethings went wrong");
                    console.log(err);
                }else{

            likes.author.id = req.user._id;
            likes.author.username = req.user.username;
            likes.save();
            blog.likes = blog.likes + 1;
            blog.save();
            res.end();
                        
                }
            });
        }
    });
});
//delete comments
app.delete("/:likes_id",middleware.checkCommentOwnership, function(req, res){
    Blog.findByIdAndRemove(req.params.likes_id, function(err, blog){
        if(err){
            res.redirect("back");
        }else{
            //  console.log(blog.likes)
            
            //   blog.likes = 0;
             
            
            // blog.likes = blog.likes - 1;
            // blog.save();
            // res.end();
            
        }
            res.redirect("/blogs/" + req.params.id);
    
    })
});

module.exports = app;
