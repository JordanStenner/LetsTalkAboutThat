let User = require("./static/schemas/user_schema");

async function loadHomepage(request, response){
    response.render("landing");
}

async function register(request, response){
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;

    let user = new User();

    user.username = username;
    user.email = email;
    user.password = password;
    user.save(function(err, savedUser){
        if(err){
            console.log(err);
            return response.status(500).send();
        }
        return response.status(200).send();
    });

    response.render("landing");
}



async function createAccount(request, response){
    response.render("createaccount");
}

module.exports.loadHomepage = loadHomepage;
module.exports.createAccount = createAccount;
module.exports.register = register;