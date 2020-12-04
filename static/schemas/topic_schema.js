var mongoose = require("mongoose");

var topicSchema = new mongoose.Schema({
    topic_title: {type: String, unique: true},
    topic_description: {type: String},
    icon_name: {type: String}
});



var Topic = mongoose.model("topic", topicSchema);

module.exports = Topic;