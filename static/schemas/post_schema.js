var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    topic: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    author: {type: String},
    date_posted: {type: Date, default: Date.now},
    post_title: {type: String},
    post_content: {type: String}
});



var Post = mongoose.model("post", postSchema);

// function getTodaysDate(){
//     let d = new Date;
//     let date = d.getDate() + "-" +
//                d.getMonth() + "-" +
//                d.getFullYear() + " " + 
//                ('0' + d.getHours()).slice(-2) + ":" + 
//                ('0' + d.getMinutes()).slice(-2) + ":" + 
//                ('0' + d.getSeconds()).slice(-2) + ' ' + 
//                (d.getHours() < 12 ? 'AM' : 'PM');
//     return date.toString();
// }

module.exports = Post;