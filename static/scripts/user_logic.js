let User = require("../schemas/user_schema");

//* Function for account registration */
async function registerAccount(username, email, password){
    var statusCode = 0;

    //User does not yet exist, so create the new account
    // let newuser = new User({username: username, 
    //                         email: email,
    //                         password: password});
    // newuser.save(function (err){
    //     if (err) {
    //         console.log("Error is :" + err);
    //         statusCode = 500
    //         return statusCode;
    //     }
    // });
    // console.log("Account created for: " + newuser.email);

    try {
        const newuser = new User({
            username: username, 
            email: email,
            password: password
        })
        let saveUser = await newuser.save();
        console.log(saveUser);
        console.log("Account created for: " + newuser.email);
    }
    catch (err){
        console.log("err" + err);
        statusCode = 500;
        return statusCode;
    }
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

async function removeUser(email){
    try{
        await User.deleteOne({email: email});
        console.log(email + ": User removed");
    }
    catch (err){
        console.log("Error" + err);
    }
}


module.exports.registerAccount = registerAccount;
module.exports.getUser = getUser;
module.exports.getUserUsingEmail = getUserUsingEmail;
module.exports.removeUser = removeUser;