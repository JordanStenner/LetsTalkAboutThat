const e = require("express");
let User = require("./static/schemas/user_schema");
let Topic = require("./static/schemas/topic_schema");

let User_Logic = require("./static/scripts/user_logic");
let Server_Logic = require("./static/scripts/server_logic");

async function loadLanding(request, response){
    if(request.session.email){
        return response.redirect("/home");
    }
    else{
        return response.render("landing", {error:""});
    }

}

async function homepage(request, response){
    let user; 
    if(request.session.email){
        user = request.session.username;
        let topicArr = [];

        await Topic.find({}, function(err, topic){
            if(err) throw err;
            for(i = 0; i < topic.length; i++){
                topicArr.push(topic[i]);
                //console.log(topic[i]["topic_title"]);
            }

        });
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
            let statusCode = User_Logic.registerAccount(username, email, password);
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

module.exports.loadLanding = loadLanding;
module.exports.createAccount = createAccount;
module.exports.register = register;
module.exports.login = login;
module.exports.homepage = homepage;
module.exports.logout = logout;