var mongoose = require("mongoose");

var likeSchema = mongoose.Schema({
   username: String
});

module.exports = mongoose.model("Like", likeSchema);