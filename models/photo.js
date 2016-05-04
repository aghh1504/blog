var mongoose = require("mongoose");
var photoSchema = new mongoose.Schema({
    path: String,
    created: {type: Date, default: Date.now},
    createdBy: String,
    
});



module.exports = mongoose.model("photo", photoSchema);