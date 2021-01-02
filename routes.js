let User = require("./static/schemas/user_schema");
let Topic = require("./static/schemas/topic_schema");
let Post = require("./static/schemas/post_schema");

let User_Logic = require("./static/scripts/user_logic");
let Post_Logic = require("./static/scripts/post_logic")
let Server_Logic = require("./static/scripts/server_logic");
const { userDisconnect } = require("./static/scripts/chatroom_logic");



async function loadLanding(request, response){
    if(request.session.email){
        return response.redirect("/home");
    }
    else{
        return response.render("landing", {error:""});
    }

}

async function chatroom(request, response){
    if(request.session.email){
        let postID = request.params.postID;
        let username = request.params.username;
        let post = await Post_Logic.getPostWithID(postID);

        return response.render("chatroom", {post: post, username: username});
    }
}

async function homepage(request, response){
    let user; 
    if(request.session.email){
        user = request.session.username;
        let topicArr = await Post_Logic.getAllTopics();

        return response.render("homepage", {username: user, topicArr: topicArr});
    }
    else{
        return response.redirect("/");
    }
}

async function login(request, response){
    let email = request.body.email.toLowerCase();
    let password = request.body.password;

    let user = await User_Logic.getUserUsingEmail(email);
        
    if(user == null){
        console.log("User does not exist");
        return response.render("landing", {error:"User does not exist"});
    }

    user.comparePassword(password, function(err, isMatch){
        if(err) throw err;

        if(isMatch == true){
            console.log("passwords match");
            Server_Logic.setSession(request, user.username, email)
            return response.redirect("/home");
        }
        else{
            console.log("passwords dont match");
            return response.render("landing", {error:"Incorrect Password"});
        }
    })
}

async function logout(request, response){
    //Remove session data
    Server_Logic.endSession(request)
    return response.render("landing", {error:""});
}

async function register(request, response){
    var errorArr = [];
    let username = request.body.username.toLowerCase();
    let email = request.body.email.toLowerCase();
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;

    let user = await User_Logic.getUser(username, email);

    if(!user){
        if(password != confirmPassword){
            errorArr.push("Both passwords must match");
            return response.render("createaccount", {error:errorArr});
        }
        else {
            let statusCode = await User_Logic.registerAccount(username, email, password);
            console.log(statusCode);
            if(statusCode == 200){
                Server_Logic.setSession(request, username, email);
                console.log(request.session.username);
                return response.redirect("/home");
            }
            else{
                return response.status(500).send();
            }
        }
    }
    else{
        if(user){
            if(user.username == username){
                errorArr.push("An account with that username already exists");
            }
            if(user.email == email){
                errorArr.push("An account with that email already exists");
            }
            console.log(errorArr);
            return response.render("createaccount", {error: errorArr});
        }
    }
}

async function createAccount(request, response){
    if(request.session.email){
        return response.redirect("/home")
    }
    else{
        return response.render("createaccount", {error:""});
    }
}

async function posts(request, response){
    const page = Number(request.params.page);
    const limit = Number(4);
    const pageStart = (page - 1) * limit;
    const pageEnd = page * limit;

    const paginatedContent = {};

    let user; 
    let topicName = request.params.topicname;

    if(request.session.email){
        user = request.session.username;

        let topic = await Post_Logic.getTopic(topicName);
        let postsArr = await findPosts(topic);

        paginatedContent.page = page;
        paginatedContent.pageStart = pageStart;
        paginatedContent.pageEnd = pageEnd;

        paginatedContent.postsFullLength = postsArr.length;

        if(pageEnd < postsArr.length){
            paginatedContent.nextPage = {
            page: page + 1,
            limit: limit
            }  
        }

        if(pageStart > 0){
            paginatedContent.previousPage = {
                page: page - 1,
                limit: limit
            }
        }


        paginatedContent.postsArr = postsArr.slice(pageStart, pageEnd);
        return response.render("posts", {username: user, paginatedContent: paginatedContent, topic: topic});
    }
    else{
        return response.redirect("/");
    }
}

async function findPosts(topic){
    let postsArr = [];
    try{
    let post = await Post.find({topic: topic._id}).sort({"date_posted": "desc"});
        for(i = 0; i < post.length; i++){
            post[i].formatted_date = formatDate(post[i].date_posted);
            postsArr.push(post[i]);
            console.log(post[i]._id);
        }
    }
    catch (err){
        console.log(err);
    }

    return postsArr;
}

function formatDate(date){
    date = new Date(date);
    date2 = date.getDate() + "-" +
           (date.getMonth() + 1) + "-" +
          date.getFullYear() + " " + 
               ('0' + date.getHours()).slice(-2) + ":" + 
               ('0' + date.getMinutes()).slice(-2) + ":" + 
               ('0' + date.getSeconds()).slice(-2) + ' ' + 
               (date.getHours() < 12 ? 'AM' : 'PM');
    return date2.toString();
}

async function createPost(request, response){
    let email = request.session.email;
    let topicName = request.params.topicname;
    let postTitle = request.body.postTitle;
    let postContent = request.body.postContent;

    let user = await User_Logic.getUserUsingEmail(email);
    let topic = await Post_Logic.getTopic(topicName);
   
    let statusCode = await Post_Logic.createPost(topic._id, user.username, postTitle, postContent);
    console.log(statusCode);
    if(statusCode == 200){
        return response.redirect("/posts/" + topicName + "/1");
    }
    else{
        return response.status(500).send();
    }
}

module.exports.loadLanding = loadLanding;
module.exports.createAccount = createAccount;
module.exports.register = register;
module.exports.login = login;
module.exports.homepage = homepage;
module.exports.logout = logout;
module.exports.posts = posts;
module.exports.createPost = createPost;
module.exports.chatroom = chatroom;