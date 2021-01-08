let Post = require("../schemas/post_schema");
let Topic = require("../schemas/topic_schema");

//* Function for account registration */
async function createPost(topic, user, title, content){
    var statusCode = 0;

    //User does not yet exist, so create the new account
    try {
        const newpost = new Post({
            topic: topic, 
            author: user, //might have to use email
            post_title: title,
            post_content: content
        })
        let savePost = await newpost.save();
        //console.log(savePost);
        console.log("Post created for: " + savePost.author);
    }
    catch (err){
        console.log("err" + err);
        statusCode = 500;
        return statusCode;
    }
    statusCode = 200
    return statusCode;
}

async function getPost(postTitle){
    let post = await Post.findOne({post_title: postTitle});
    return post;
}

async function getPostWithID(postID){
    let post = await Post.findOne({_id: postID});
    return post;
}

async function findPosts(topic){
    let postsArr = [];
    try{
    let post = await Post.find({topic: topic._id}).sort({"date_posted": "desc"});
        for(i = 0; i < post.length; i++){
            post[i].formatted_date = formatDate(post[i].date_posted);
            postsArr.push(post[i]);
        }
    }
    catch (err){
        console.log(err);
    }

    return postsArr;
}

async function getTopic(topicTitle){
    let topic = await Topic.findOne({topic_title: topicTitle});
    return topic;
}

async function getAllTopics(){
    let topicsArr = [];
    try{
    let topic = await Topic.find({});
        for(i = 0; i < topic.length; i++){
            topicsArr.push(topic[i]);
            //console.log(post[i]["topic"]);
        }
    }
    catch (err){
        console.log(err);
    }
    return topicsArr;
}

async function removePost(postTitle){
    try{
        await Post.deleteOne({post_title: postTitle});
        console.log(postTitle + ": Post removed");
    }
    catch (err){
        console.log("Error" + err);
    }
}

function formatDate(date){
    date = new Date(date);
    let day = date.getDate();
    let month = (date.getMonth() + 1);
    day = day > 9 ? day : "0" + day;
    month = month > 9 ? month : "0" + month;

    date2 = day + "-" +
            month + "-" +
            date.getFullYear() + " " + 
               ('0' + date.getHours()).slice(-2) + ":" + 
               ('0' + date.getMinutes()).slice(-2) + ":" + 
               ('0' + date.getSeconds()).slice(-2) + ' ' + 
               (date.getHours() < 12 ? 'AM' : 'PM');
    return date2.toString();
}


module.exports.createPost = createPost;
module.exports.getPost = getPost;
module.exports.removePost = removePost;
module.exports.getPostWithID = getPostWithID;
module.exports.findPosts = findPosts;
module.exports.formatDate = formatDate;

module.exports.getTopic = getTopic;
module.exports.getAllTopics = getAllTopics;