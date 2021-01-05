let chai = require("chai");
let chaiHttp = require("chai-http");
//var request = require("supertest");
let server = require("../startserver");
const User = require("../static/schemas/user_schema");
const expect = chai.expect;
const should = chai.should();
let cheerio = require("cheerio");

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

    // test("Test GET landing route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

    // test("Test GET logout route", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/logout")
    //         .end(function(error, response){
    //             chai.assert.equal(response.status, 200, "Wrong status code");
    //         });
    //     done();
    // });

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

    // test("Test login with valid credentials", function(){
    //     let app = server.app;
    //     let agent = chai.request.agent(app);

    //     agent
    //         .post('/login')
    //         .send({email: testEmail, password: testPassword})
    //         .then(function (response){
    //             expect(response).to.have.cookie('user_id');
    //             expect(response).to.redirectTo(/\/home/);
    //         });
    //         agent.close();
    // });

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





//Supertest tests

    // test("Test homepage when not logged in", function(done){
    //     let app = server.app;
    //     chai.request(app).get("/home")
    //         .then(function(error, response){
    //             expect(response).to.redirectTo(/\//);
    //             expect(response).to.have.status(302);
    //             chai.request(app).get("/")
    //                 expect(response).to.have.status(200);
    //         })
    //         .catch(function (err){
    //             throw err;
    //         });
    //         done();
    // });

    // test("Test homepage when logged in", function(done){
    //     let app = server.app;
    //     let agent = chai.request.agent(app);

    //     agent
    //         .post('/login')
    //         .send({email: 'test@test.com', password: 't'})
    //         .then(function (response){
    //             expect(response).to.have.cookie('user_id');
    //             expect(response).to.redirectTo(/\/home5/)
    //             agent.get('/home')
    //                 .then(function(response){
    //                     expect(response).to.have.status(2);
    //                 })
    //                 .catch(function (error){
    //                     throw error;
    //                 });
    //         })
    //         .catch(function (error){
    //             throw error;
    //         });
    //     agent.close();
    //     done();
    // });
});