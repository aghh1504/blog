var express = require("express");
var app = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");



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

//setting
 app.get("/setting",middleware.isLoggedIn,function(req, res) {
     res.render("setting",{ message: "" });
 });
 app.post("/setting",middleware.isLoggedIn, function(req, res) {
     console.log('hello');
     // create variable to store
     var description = req.body.description;
     var cover = req.body.cover;
     var photo = req.body.photo;
     
     var user = req.user;
     console.log(req.user);
     //var connected with user
    user.description = description ;
    user.cover = cover;
    user.photo = photo;
    
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
              res.redirect("my-blog" );
        });
    });
     
 });
module.exports = app;