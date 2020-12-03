let User = require("./static/schemas/user_schema");

async function loadLanding(request, response){
    response.render("landing", {error:""});
}

async function homepage(request, response){
    response.render("homepage");
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
                return response.render("homepage");
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
            // let newSession = request.session;
            // newSession.email = newuser.email;
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
    response.render("createaccount", {error:""});
}

module.exports.loadLanding = loadLanding;
module.exports.createAccount = createAccount;
module.exports.register = register;
module.exports.login = login;
module.exports.homepage = homepage;
module.exports.logout = logout;