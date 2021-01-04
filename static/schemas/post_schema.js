var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    topic: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    author: {type: String},
    date_posted: {type: Date, default: Date.now},
    post_title: {type: String},
    post_content: {type: String}
});

var Post = mongoose.model("post", postSchema);

module.exports = Post;