var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String}
});

var User = mongoose.model("newUser", userSchema);

module.exports = User;