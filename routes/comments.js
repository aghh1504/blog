var express = require("express");
var app = express.Router({mergeParams: true}); 
var Blog = require("../models/blog");
var Comment = require("../models/comments");
var middleware = require("../middleware");
  
  
 
//add comment get
app.get("/new",middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err) {
            console.log(err);
        } else {
            res.render("news", {blog: blog});
        }
    });
});
//comments post
app.post("/",middleware.isLoggedIn, function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                     req.flash("error", "Somethings went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    blog.comments.push(comment);
                    blog.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/blogs/" + blog._id);
                }
            });
        }
    });
});

//edit comment
app.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        } else {
             res.render("edits", {blog_id:  req.params.id, comment: foundComment});
        }
    });
  
});
//update comments
app.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//delete comments
app.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
             req.flash("success", "Comment deleteed");
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

module.exports = app;
