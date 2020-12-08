let User = require("../schemas/user_schema");

//* Function for account registration */
function registerAccount(request, response){
    let username = request.body.username.toLowerCase();
    let email = request.body.email.toLowerCase();
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;
    //User does not yet exist, so create the new account
    let newuser = new User();
    newuser.username = username;
    newuser.email = email;
    newuser.password = password;
    newuser.save(function(err, savedUser){
        if(err){
            console.log(err);
            return response.status(500);
        }
        console.log("Account created for: " + email);
        return response.status(200);
    });
}

// async function getUser(username, email){
//     let user = await User.findOne({$or: [{username: username}, {email: email}]});
//     return user;
// }

module.exports.registerAccount = registerAccount;