let mongoose = require("mongoose");
let chai = require("chai");
let sinon = require('sinon');

let routes = require("../routes");
let User_Logic = require("../static/scripts/user_logic");
let Server_Logic = require("../static/scripts/server_logic");
let User = require("../static/schemas/user_schema");

let url = "mongodb://localhost:27017/LetsTalkAboutThatTesting";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
console.log(mongoose.connection.readyState);

//Test suite for User_Logic functions
suite("Tests for User Logic", function(){
    var testEmail ="Testing@Unit.Test";
    var testUsername = "TestUser";
    setup(async function(){
        try {
            const newuser = new User({
                username: testUsername, 
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
        let testUser = await User.findOne({email: testEmail});
        if(!testUser){
            console.log("User already deleted by test")
        }
        else{
            await User.deleteOne({email: testEmail}, function(err){
                if(err) console.log(err);
                console.log("Test user deleted");
            });
        }

    });
    
    test("Test the registerAccount function", async function(){
        let testRegisterEmail = "Testing1@Unit.Test";
        let statusCode = await User_Logic.registerAccount("TestUser1", testRegisterEmail, "Testpassword");
        let newuser = await User.findOne({email: testRegisterEmail});
        //console.log("User email is: " +newuser.email);

        chai.assert.equal(statusCode, 200, "Status code should be 200 after creating a user");
        chai.assert.equal(newuser.email, testRegisterEmail, "User email should match - Successfully saved to database");

        try{
            await User.deleteOne({email: testRegisterEmail});
        }
        catch (err){
            console.log("Error" + err);
        }

        });

    test("Test the getUser function", async function(){
        let user = await User_Logic.getUser(testUsername, testEmail);

        chai.assert.equal(user.email, testEmail, "Emails should match indicating that a user has been found");
    });

    test("Test the getUserUsingEmail function", async function(){
        let user = await User_Logic.getUserUsingEmail(testEmail);

        chai.assert.equal(user.email, testEmail, "Emails should match indicating that a user has been found");
    });

     test("Test the removeUser function", async function(){
         let removed = false;
        await User_Logic.removeUser(testEmail);

        let testUser = await User.findOne({email: testEmail});
        if(!testUser){
            removed = true;
        }

        chai.assert.equal(removed, true, "User has not been removed from the database");
     });

});

suite("Test routes functions", function(){
    var testEmail ="Testing@Unit.Test";
    var testUsername = "TestUser";
    setup(async function(){
        try {
            const newuser = new User({
                username: testUsername, 
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
        let testUser = await User.findOne({email: testEmail});
        if(!testUser){
            console.log("User already deleted by test")
        }
        else{
            await User.deleteOne({email: testEmail}, function(err){
                if(err) console.log(err);
                console.log("Test user deleted");
            });
        }

    });

    // test("GET loadLanding", function(){
    //     let request = {};
    //     let response = {};
    //     response.send = sinon.spy();

    //     routes.loadLanding(request, response);
    //     chai.assert.isTrue(response.send.loadLanding);
    // });
});
