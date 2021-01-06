let chai = require("chai");
let chaiHttp = require("chai-http");
let cheerio = require("cheerio");

let server = require("../startserver");
const { deleteOne } = require("../static/schemas/user_schema");
const User = require("../static/schemas/user_schema");
const Post = require("../static/schemas/post_schema");
const expect = chai.expect;


chai.use(chaiHttp);

suite("Test routes", function(){
    const email = "inttesting@testing.test";

    teardown(async function(){
        this.timeout(10000);
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

    test("Test GET home route without active session", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/home");

        chai.assert.equal(response.status, 200, "Wrong status code");
        expect(response).to.redirectTo(/\//);
    });

    test("Test GET home route with active session", async function(){
        let app = server.app;

        var agent = chai.request.agent(app);

        await agent.post("/login")
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        })
        .then(async function(response){
            await agent.get("/home")
            .then(function(res){
                chai.assert.equal(res.status, 200, "Wrong status code");
            });
        });
    });

    test("Test GET posts route without active session", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/posts/Politics/1");

        chai.assert.equal(response.status, 200, "Wrong status code");
        expect(response).to.redirectTo(/\//);
    });

    test("Test GET posts route with active session", async function(){
        let app = server.app;

        var agent = chai.request.agent(app);

        await agent.post("/login")
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        })
        .then(async function(response){
            await agent.get("/posts/Politics/1")
            .then(function(res){
                let $ = cheerio.load(res.text);
                let postTitle = $('.post-title').html();

                chai.assert.equal(res.status, 200, "Wrong status code");
                chai.assert.equal(postTitle, "First Politics Post", "Posts were not output");
            });
        });
        agent.close();
    });

    test("Test GET createaccount route without active session", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/createaccount");

        let $ = cheerio.load(response.text);
        let title = $('#create-account-title').html();

        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.assert.equal(title, "Create an account", "Route did not load the create account page");
        
    });

    test("Test GET home route with active session", async function(){
        let app = server.app;

        var agent = chai.request.agent(app);

        await agent.post("/login")
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        })
        .then(async function(response){
            await agent.get("/createaccount")
            .then(function(res){
                chai.assert.equal(res.status, 200, "Wrong status code");
                expect(res).to.redirectTo(/\/home/);
            });
        });
        agent.close();
    });

    test("Test GET logout route", async function(){
        let app = server.app;
        let response = await chai.request(app).get("/logout");

        let $ = cheerio.load(response.text);
        let err = $('#error').html();

        chai.assert.equal(response.status, 200, "Wrong status code");
        chai.assert.equal(err, "", "Error should be empty");

    });

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

    test("Test POST createpost route", async function(){
        let app = server.app;
        
        var agent = chai.request.agent(app);

        await agent.post("/login")
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        })
        .then(async function(response){
            await agent.post("/createpost/Politics")
            .type("form")
            .send({
                postTitle: "Test post",
                postContent: "Test post"
            })
            .then(async function(res){
                chai.assert.equal(res.status, 200, "Wrong status code");
                expect(res).to.redirectTo(/\/posts\/Politics\/1/);

                await agent.get("/posts/Politics/1")
                .then(function(postRes){
                    let $ = cheerio.load(postRes.text);
                    let postTitle = $('.post-title').html();
                    chai.assert.equal(postTitle, "Test post", "createpost route does not create post");
                });
            });
        });
        agent.close();
        await Post.deleteOne({post_title: "Test post"}, function(err){
            if(err) console.log(err);
            console.log("Test post deleted");

        });
    });

    test("Test GET chatroom route without active session", async function(){
        let app = server.app;
        let postID = "5ff09d56a78dee001790cc47";
        let username = "testingusername";

        let response = await chai.request(app).get("/chatroom/" + postID + "/" + username);

        let $ = cheerio.load(response.text);
        let heading = $('.heading').html();

        chai.assert.equal(response.status, 200, "Wrong status code");
        expect(response).to.redirectTo(/\//);
        chai.assert.equal(heading, "Let's Talk About That", "Route did not send the user to homepage");
    });

    test("Test GET chatroom route with active session", async function(){
        let app = server.app;
        let postID = "5ff09d56a78dee001790cc47";
        let username = "testingusername";

        var agent = chai.request.agent(app);

        await agent.post("/login")
        .type("form")
        .send({
            email: 'testingemail@test.test', 
            password: 'password'
        })
        .then(async function(response){
            await agent.get("/chatroom/" + postID + "/" + username)
            .then(async function(res){
                let $ = cheerio.load(res.text);
                let postTitle = $('#post-title').html();

                chai.assert.equal(res.status, 200, "Wrong status code");
                chai.assert.equal(postTitle, "First Politics Post", "Route did not send the user to chatroom");
            });
        });
        agent.close();
    });
});