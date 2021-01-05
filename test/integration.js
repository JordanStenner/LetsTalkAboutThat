let chai = require("chai");
let chaiHttp = require("chai-http");
let cheerio = require("cheerio");
//var request = require("supertest");
let server = require("../startserver");
const User = require("../static/schemas/user_schema");
const expect = chai.expect;


chai.use(chaiHttp);

suite("Test routes", function(){
    const email = "inttesting@testing.test";

    teardown(async function(){
        let testUser = await User.findOne({email: email});
        if(!testUser){
            console.log("User did not exist");
        }
        else{
            await User.deleteOne({email: email}, function(err){
                if(err) console.log(err);
                console.log("Test user deleted");
            });
        }
    });

    test("Test GET landing route", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/");

        let $ = cheerio.load(response.text);
        let err = $('#error').html();

        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.assert.equal(err, "", "Error should be empty");

    });

    // test("Test GET logout route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/logout")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    test("Test GET logout route", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/logout");

        let $ = cheerio.load(response.text);
        let err = $('#error').html();

        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.assert.equal(err, "", "Error should be empty");

    });

    // test("Test GET home route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/home")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    // test("Test GET posts route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/posts/:topicname/:page")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    // test("Test POST createaccount route", function(done){
    //     let app = server.app;
    //     chai.request(app).post("/createaccount")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    test("Test POST register route", async function(){
        let app = server.app;
        this.timeout(10000);
        let response = await chai.request(app).post("/register")
            .type("form")
            .send({
                username: "Test user2",
                email: email,
                password: "Password",
                confirmPassword: "Password"
            });
            chai.assert.equal(response.status, 200, "Wrong status code");

            let intTestUser = await User.findOne({email: email});

            chai.assert.equal(intTestUser.email, email, "New user was not created using /register");
    });

    test("Test POST login with invalid credentials", async function(){
        let app = server.app;
        let response = await chai.request(app).post('/login')
        .type("form")
        .send({
            email: 'wrong@wrong.com', 
            password: 'wrong'
        });

        let $ = cheerio.load(response.text);
        let err = $('#error').html();
        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.assert.equal(err, "User does not exist", "Wrong error output");
    });

    test("Test POST login with valid credentials", async function(){
        let app = server.app;
        let response = await chai.request(app).post('/login')
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        });

        chai.assert.equal(response.status, 200, "Wrong status code");
        expect(response).to.redirectTo(/\/home/);
    });

    // test("Test GET chatroom route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/logout")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    // test("Test POST createpost route", function(done){
    //     let app = server.app;
    //     chai.request(app).post("/createpost/:topicname")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

});