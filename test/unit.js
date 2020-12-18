let mongoose = require("mongoose");
let chai = require("chai");
let User_Logic = require("../static/scripts/user_logic");
let Server_Logic = require("../static/scripts/server_logic");
let User = require("../static/schemas/user_schema");

let url = "mongodb://localhost:27017/LetsTalkAboutThatTesting";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
console.log(mongoose.connection.readyState);

suite("Tests for User Logic", function(){

    setup(async function(){
        let testEmail = "Testing@Unit.Test";
        try {
            const newuser = new User({
                username: "TestUser", 
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
        let testEmail = "Testing@Unit.Test";
        await User.deleteOne({email: testEmail}, function(err){
            if(err) console.log(err);
            console.log("Test user deleted");
        });
    });
    
    test("Test the registerAccount function", async function(){
        let testEmail = "Testing1@Unit.Test";
        let statusCode = await User_Logic.registerAccount("TestUser1", testEmail, "Testpassword");
        let newuser = await User.findOne({email: testEmail});
        //console.log("User email is: " +newuser.email);

        chai.assert.equal(statusCode, 200, "Status code should be 200 after creating a user");
        chai.assert.equal(newuser.email, testEmail, "User email should match - Successfully saved to database");

        try{
            await User.deleteOne({email: testEmail});
        }
        catch (err){
            console.log("Error" + err);
        }

        });
});
