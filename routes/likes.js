var express = require("express");
var app = express.Router({mergeParams: true}); 
var Blog = require("../models/blog");
var Like = require("../models/like");
//var middleware = require("../middleware");
  
  

//likes post
app.post("/",function(req, res) {

    console.log("BLOG FINDBYID " + req.params.id);
    Blog.findById(req.params.id, function(err, blog) {
        
        if(err){
            console.log(err);
            res.status(500).send("error reading blog");
        } else {
            function continueProcess() {
                console.log("-----BEFORE userHasAlreadyLiked " + userHasAlreadyLiked)
                if(userHasAlreadyLiked){
                    console.log("-----DONT GO THERE NEW LIKE userHasAlreadyLiked")
                     res.status(400).send("You already liked this");
                } else {
                    
                    var newLike = {
                        username: req.user.username
                    }
        
                    Like.create(newLike, function(err, createdLike) {
                        if (err){
                            console.log(err);
                            res.status(500).send("error creating like");
                        } else {
                            console.log("-----WHERE WE SAVE " + newLike)
                            blog.likes.push(createdLike._id);
                            blog.save(function(err){
                                 if(err){
                                     console.log("-----WHERE SAVE LIKE FAIL ")
                                    console.log(err);
                                    res.status(500).send("error creating like");
                                 }else{
                                     console.log("-----WHERE SAVE LIKE SUCCEED ")
                                     //res.send("recorded");
                                     blog.save(function(err) {
                                    console.log("-----WHERE SAVE BLOG")
                                     if (err){
                                        console.log(err, blog);
                                        res.status(500).send("error creating like");
                                     } else {
                                         res.send("recorded");
                                     }
                                    });
                                 }
                            });
                        }
                    });
                
                }
            };
            console.log("-----Blog likes " + blog)
            if(blog.likes === undefined) {
                console.log("-----Blog likes undefined")
                blog.likes = [];
            }
            var userHasAlreadyLiked = false;
            
            var nbCalls = 0;
            function barrier(){
                nbCalls++;
                if(blog.likes.length === nbCalls){
                    continueProcess();
                }    
            }
            
            if(blog.likes.length === 0){
                continueProcess()   
            } else {
                for(var index =0; index<blog.likes.length; index++){
                    var currentLike = blog.likes[index];
                    console.log("-----GO THERE UPDATE LIKE " + currentLike)
                    var actualLike;
                    Like.findById(currentLike, function(err, actualLike) {
                        console.log("Likes findById " + actualLike);
                        console.log(currentLike, actualLike, req.user.username, actualLike.username, actualLike.username === req.user.username)
                        if(actualLike.username === req.user.username){
                            userHasAlreadyLiked = true;
                            barrier();
                        }                     
                    });
                }
            }
        }
    });
});
//delete comments
// app.delete("/:likes_id",middleware.checkCommentOwnership, function(req, res){
//     Blog.findByIdAndRemove(req.params.likes_id, function(err, blog){
//         if(err){
//             res.redirect("back");
//         }else{
//             //  console.log(blog.likes)
            
//             //   blog.likes = 0;
             
            
//             // blog.likes = blog.likes - 1;
//             // blog.save();
//             // res.end();
            
//         }
//             res.redirect("/blogs/" + req.params.id);
    
//     })
// });

module.exports = app;
