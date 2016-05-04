var express = require("express");
var app = express.Router({mergeParams: true}); 
var Blog = require("../models/blog");
var Like = require("../models/like");
var middleware = require("../middleware");
  
  

//likes post
app.post("/",middleware.isLoggedIn,function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err){
            console.log(err);
            res.status(500).send("error reading blog");
        } else {
            console.log(blog.likes)
            if(blog.likes === undefined) {
              blog.likes = [];
            }
            var userHasAlreadyLiked = false;
            for(var index =0; index<blog.likes.length; index++){
                var currentLike = blog.likes[index];
                console.log(currentLike, req.user.username, currentLike.username === req.user.username)
                if(currentLike.username === req.user.username){
                    userHasAlreadyLiked = true;
                } 
            }
            if(userHasAlreadyLiked){
                 res.status(400).send("You already liked this");
                 return
            }
            var newLike = {
                username: req.user.username
                }
            Like.create(newLike, function(err, createdLike) {
                if(err){
                     res.status(500).send("error creating like");
                    console.log(err);
                }else{

                    blog.likes.push(createdLike);
                    blog.save(function(err){
                         if(err){
                            res.status(500).send("error creating like");
                            console.log(err);
                         }else{
                             res.send("recorded");
                         }
                    });
                   
                        
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
