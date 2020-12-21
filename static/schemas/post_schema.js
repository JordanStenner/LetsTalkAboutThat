var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    topic: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    author: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    post_title: {type: String, unique: true},
    post_content: {type: String}
});



var Post = mongoose.model("post", postSchema);

module.exports = Post;