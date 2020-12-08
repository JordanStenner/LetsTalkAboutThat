let User = require("../schemas/user_schema");

//* Function for account registration */
function registerAccount(request, username, email, password){
    var statusCode = 0;

    //User does not yet exist, so create the new account
    let newuser = new User({username: username, 
                            email: email,
                            password: password});
    newuser.save(function (err){
        if (err) {
            console.log("Error is :" + err);
            statusCode = 500
            return statusCode;
        }
    });
    console.log("Account created for: " + newuser.email);
    statusCode = 200
    return statusCode;
}

async function getUser(username, email){
    let user = await User.findOne({$or: [{username: username}, {email: email}]});
    return user;
}

async function getUserUsingEmail(email){
    let user = await User.findOne({email: email});
    return user;
}


module.exports.registerAccount = registerAccount;
module.exports.getUser = getUser;
module.exports.getUserUsingEmail = getUserUsingEmail;