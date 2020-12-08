const e = require("express");
let User = require("./static/schemas/user_schema");
let Topic = require("./static/schemas/topic_schema");

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
                console.log(topic[i]["topic_title"]);
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

    User.findOne({email: email}, function(err, user){
        if(err) throw err;
        
        if(user == null){
            console.log("User does not exist");
            return response.render("landing", {error:"User does not exist"});
        }

        user.comparePassword(password, function(err, isMatch){
            if(err) throw err;

            if(isMatch == true){
                console.log("passwords match");
                request.session.username = user.username;
                request.session.email = user.email;
                return response.redirect("/home");
            }
            else{
                console.log("passwords dont match");
                return response.render("landing", {error:"Incorrect Password"});
            }
        })
    });
    //response.redirect("/");
}

async function logout(request, response){
    //Remove session data
    request.session.destroy();
    return response.render("landing", {error:""});
}

async function register(request, response){
    var errorArr = [];
    let username = request.body.username.toLowerCase();
    let email = request.body.email.toLowerCase();
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;

    let user = await User.findOne({$or: [{username: username}, {email: email}]});

    if(!user){
        //User does not yet exist, so create the new account
        let newuser = new User();

        newuser.username = username;
        newuser.email = email;
        newuser.password = password;
        newuser.save(function(err, savedUser){
            if(err){
                console.log(err);
                return response.status(500).send();
            }
            console.log("Account created for: " + email);
            request.session.username = newuser.username;
            request.session.email = newuser.email;
            response.redirect("/home");
            return response.status(200).send();  
        });
    }
    else{
        if(user){
            if(user.username == username){
                errorArr.push("An account with that username already exists");
            }
            if(user.email == email){
                errorArr.push("An account with that email already exists");
            }
            if(password != confirmPassword){
                errorArr.push("Both passwords must match");
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