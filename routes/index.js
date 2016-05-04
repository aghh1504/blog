var express = require("express");
var app = express.Router();
var passport = require("passport");
var User = require("../models/user");

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
    var newUser = new User({username: req.body.username, photo: req.body.photo, cover: req.body.cover});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Travel Blog " + user.username);
            res.redirect("/blogs");
        });
    });
});

// logic route logout
app.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/blogs");
});
module.exports = app;