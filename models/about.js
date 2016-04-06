var mongoose = require("mongoose");


var aboutSchema = new mongoose.Schema({
   image: String,
   description: String
  });

module.exports = mongoose.model("about", aboutSchema);