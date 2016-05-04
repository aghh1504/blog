var express = require("express");
var router= express.Router();
var Photo = require("../models/photo");
var User = require("../models/user");
var multer = require('multer');
var upload =multer({dest:'./multer_uploads/'});
var fs = require("fs");
 
 //uploads cover photo
router.get("/", function(req,res){
    res.render("upload", { title: 'ONIX Validator' });
});
router.post('/',upload.single('photo'), function(req, res) {
  var photoName = req.user.username + "_" + req.file.filename + ".jpg"
  var newPath = "./public/uploads/" + photoName
  fs.renameSync(req.file.path, newPath);
  console.log(req.file);
 
  console.log(newPath);
  var photo = {
      path: newPath,
    created: {type: Date, default: Date.now},
    createdBy: req.user.username
    }
    
  Photo.create(req.body.photo, function(err, newphoto){
    if(err){
      res.json(err);
      }else{
        // res.send("photo uploaded");
          fs.unlink(photoName, function() {
            if (err) throw err;
           
        });
        
         
     var user = req.user;
     console.log(req.user);
     //var connected with user
    user.cover = "/uploads/" + photoName ;
 
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
  // res.redirect("/photo/"+ photoName);
  }
  })
})


module.exports = router;

