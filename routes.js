let User = require("./static/schemas/user_schema");

async function loadHomepage(request, response){
    response.render("landing");
}

async function login(request, response){
    let email = request.body.email.toLowerCase();
    let password = request.body.password;

    User.findOne({email: email}, function(err, user){
        if(err) throw err;

        user.comparePassword(password, function(err, isMatch){
            if(err) throw err;

            if(isMatch == true){
                console.log("passwords match");
                return response.render("landing");
            }
            else{
                console.log("passwords dont match");
                return response.render("createaccount", {error:""});
            }
        })
    });
    //response.redirect("/");
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
            response.redirect('/');
            return response.status(200).send();  
        });
    }
    else{
        if(user){
            console.log(user.username);
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

module.exports.loadHomepage = loadHomepage;
module.exports.createAccount = createAccount;
module.exports.register = register;
module.exports.login = login;