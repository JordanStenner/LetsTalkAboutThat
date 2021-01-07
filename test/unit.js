let mongoose = require("mongoose");
let chai = require("chai");
let sinon = require('sinon');

const routes = require("../routes");
const User_Logic = require("../static/scripts/user_logic");
const Post_Logic = require("../static/scripts/post_logic");
const Chatroom_Logic = require("../static/scripts/chatroom_logic");
const Server_Logic = require("../static/scripts/server_logic");

const User = require("../static/schemas/user_schema");
const Post = require("../static/schemas/post_schema");
const Topic = require("../static/schemas/topic_schema");

let url = "mongodb+srv://JordanStenner:LTATDB@letstalkaboutthat.imvzx.mongodb.net/LetsTalkAboutThatTesting?retryWrites=true&w=majority";



//Test suite for User_Logic functions
suite("Tests for User Logic", function(){
    var testEmail ="Testing@Unit.Test";
    var testUsername = "TestUser";

    suiteSetup(function(){
        mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
        console.log("DB ReadyState: " + mongoose.connection.readyState);
    });

    suiteTeardown(function(done){
        mongoose.connection.close();
        done();
    });
    
    setup(async function(){
        this.timeout(10000);
        try {
            const newuser = new User({
                username: testUsername, 
                email: testEmail,
                password: "testPassword"
            })
            let saveUser = await newuser.save();
            //console.log(saveUser);
        }
        catch (err){
            console.log("err" + err);
        }
    });

    teardown(async function(){
        let testUser = await User.findOne({email: testEmail});
        if(!testUser){
            console.log("User already deleted by a test")
        }
        else{
            await User.deleteOne({email: testEmail}, function(err){
                if(err) console.log(err);
                console.log("Test user deleted");
            });
        }

    });
    
    test("Test the registerAccount function", async function(){
        let testRegisterEmail = "Testing1@Unit.Test";
        let statusCode = await User_Logic.registerAccount("TestUser1", testRegisterEmail, "Testpassword");
        let newuser = await User.findOne({email: testRegisterEmail});

        chai.assert.equal(statusCode, 200, "Status code should be 200 after creating a user");
        chai.assert.equal(newuser.email, testRegisterEmail, "User email should match - Successfully saved to database");


        User.deleteOne({email: testRegisterEmail}, function(error, result){
            if(error)
                console.log("Error occured - User not deleted");
        });
    });

    test("Test the getUser function", async function(){
        let user = await User_Logic.getUser(testUsername, testEmail);

        chai.assert.equal(user.email, testEmail, "Emails should match indicating that a user has been found");
    });

    test("Test the getUserUsingEmail function", async function(){
        let user = await User_Logic.getUserUsingEmail(testEmail);

        chai.assert.equal(user.email, testEmail, "Emails should match indicating that a user has been found");
    });

     test("Test the removeUser function", async function(){
         let removed = false;
        await User_Logic.removeUser(testEmail);

        let testUser = await User.findOne({email: testEmail});
        if(!testUser){
            removed = true;
        }

        chai.assert.equal(removed, true, "User has not been removed from the database");
     });
});

suite("Tests for Post Logic", function(){
    const topicTitle = "Politics";
    const politicsID = "5fe0dced9ef93c549c12c82e";
    const author = "Unit Test";
    const postTitle = "Unit Test Post";
    const postContent = "Unit Test Content";
    suiteSetup(function(){
        mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
        console.log("DB ReadyState: " + mongoose.connection.readyState);
    });

    suiteTeardown(function(done){
        mongoose.connection.close();
        done();
    });
    
    setup(async function(){
        this.timeout(10000);
        try {
            const newpost = new Post({
                topic: politicsID,
                author: author, 
                post_title: postTitle,
                post_content: postContent
            })
            let savePost = await newpost.save();
            //console.log(saveUser);
        }
        catch (err){
            console.log("err" + err);
        }
    });

    teardown(async function(){
        let testPost = await Post.findOne({post_title: postTitle});
        if(!testPost){
            console.log("Post already deleted by a test")
        }
        else{
            await Post.deleteOne({post_title: postTitle}, function(err){
                if(err) console.log(err);
                console.log("Test post deleted");
            });
        }
    });

    test("Test the createPost function", async function(){
        const newPostTitle = "Post Title";
        let statusCode = await Post_Logic.createPost(politicsID, author, newPostTitle, postContent);
        let newpost = await Post.findOne({post_title: newPostTitle});

        chai.assert.equal(statusCode, 200, "Status code should be 200 after creating a post");
        chai.assert.equal(newpost.post_title, newPostTitle, "Post titles should match - Successfully saved to database");

        Post.deleteOne({post_title: newPostTitle}, function(error, result){
            if(error)
                console.log("Error occured - User not deleted");
       });
    });

    test("Test the getPost function", async function(){
        let post = await Post_Logic.getPost(postTitle);

        chai.assert.equal(post.post_title, postTitle, "Post titles should match indicating that a post has been found");
    });

    test("Test the getPostWithID function", async function(){
        let postObj = await Post.findOne({post_title: postTitle});
        const postID = postObj._id;
        let post = await Post_Logic.getPostWithID(postID);

        chai.assert.equal(post.post_title, postTitle, "Post titles should match indicating that a post has been found");
    });

    test("Test the removePost function", async function(){
        let postDeleted = false;

        await Post_Logic.removePost(postTitle);

        let post = await Post.findOne({post_title: postTitle});
        if(!post){
            postDeleted = true;
        }
        chai.assert.isTrue(postDeleted, "Post should be deleted from the database")
    });

    test("Test the getTopic function", async function(){
        let topic = await Post_Logic.getTopic(topicTitle);

        chai.assert.equal(topic.topic_title, topicTitle, "Topic titles should match indicating that a topic has been found");
    });
    
    test("Test the getAllTopics function", async function(){
        let topic = await Topic.findOne({topic_title: "Gaming"});
        let topicArr = await Post_Logic.getAllTopics();

        chai.assert.equal(topic.topic_title, topicArr[1].topic_title, "Topic titles should be equal");
        chai.assert.equal(topicArr.length, 2, "Number of topics in the database should equal 2");
    });

    test("Test the formatDate function", function(){
        let date = new Date(2020, 11, 28, 12, 30, 0);
        let clock = sinon.useFakeTimers(date);

        let formattedDate = Post_Logic.formatDate(date);

        chai.assert.equal(formattedDate, "28-12-2020 12:30:00 PM", "formatDate did not output the correct value");
        clock.restore();
    });
});

suite("Test chatroom logic", function(){
    let clock;
    suiteSetup(function(){
        let date = new Date(2020, 11, 28, 12, 30, 0);
        clock = sinon.useFakeTimers(date);
        
        console.log("Sinon date set")
    });

    suiteTeardown(function(){
        clock.restore();
    });

    test("Test formatMessageContent function", function(){
        let testUser = "TestUser";
        let testMessage = "Message";
        let content = Chatroom_Logic.formatMessageContent(testUser, testMessage);

        chai.assert.equal(content.username, testUser, "Username should be equal");
        chai.assert.equal(content.content, testMessage, "Message content should be equal");
        chai.assert.equal(content.time, "12:30:PM", "Message content time should equal 12:30:PM");
    });

    test("Test getTime function", function(){
        let time = Chatroom_Logic.getTime();

        chai.assert.equal(time, "12:30:PM", "Message content time should equal 12:30:PM");
    });
});
