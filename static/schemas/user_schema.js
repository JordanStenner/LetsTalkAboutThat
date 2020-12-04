var mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, required: true}
});

userSchema.pre('save', function(next){
    var user = this;

    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        cb(null, isMatch);
    });
}

var User = mongoose.model("user", userSchema);

module.exports = User;