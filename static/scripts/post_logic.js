let Post = require("../schemas/post_schema");

//* Function for account registration */
async function createPost(topic, user, title, content){
    var statusCode = 0;

    //User does not yet exist, so create the new account
    try {
        const newpost = new Post({
            topic: topic._id, 
            author: user._id, //might have to use email
            post_title: title,
            post_content: content
        })
        let savePost = await newpost.save();
        console.log(savePost);
        console.log("Post created for: " + newpost.author);
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

async function removePost(postTitle){
    try{
        await Post.deleteOne({post_title: postTitle});
        console.log(postTitle + ": Post removed");
    }
    catch (err){
        console.log("Error" + err);
    }
}


module.exports.createPost = createPost;
module.exports.getPost = getPost;
module.exports.removePost = removePost;