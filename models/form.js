var mongoose = require("mongoose");

var formSchema = new mongoose.Schema({
    date:Date
});

module.exports = mongoose.model("Form", formSchema);