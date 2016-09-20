var mongoose = require("mongoose");
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    imageA: String,
    imageB: String,
    imageC: String,
    created: {type: Date, default: Date.now},
    createdBy: String,
    comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Comment"
                    
                }
              ],
    likes:    [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Like"
                    
                }
              ]           
    
});


module.exports = mongoose.model("blog", blogSchema);