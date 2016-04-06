var mongoose = require("mongoose");
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    imageA: String,
    imageB: String,
    imageC: String,
    created: {type: Date, default: Date.now},
    createdBy: String
    
});



module.exports = mongoose.model("blog", blogSchema);