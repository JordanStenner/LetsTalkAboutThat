let chai = require("chai");
let chaiHttp = require("chai-http");
//var request = require("supertest");
let server = require("../startserver");
const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

suite("Test routes", function(){

    test("Test landing page", function(done){
        let app = server.app;
        chai.request(app).get("/")
            .end(function(error, response){
                chai.assert.equal(response.status, 200, "Wrong status code");
            });
        done();
    });

    test("Test logout page", function(done){
        let app = server.app;
        chai.request(app).get("/logout")
            .end(function(error, response){
                chai.assert.equal(response.status, 200, "Wrong status code");
            });
        done();
    });

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

    // test("Test login with invalid credentials", function(done){
    //     let app = server.app;
    //     chai.request(app).post('/login')
    //     .send({email: 'wrong@wrong.com', password: 'wrong'})
    //     .then(function(error, response){
    //         expect(response).to.have.status(200);
    //         expect(response.body).to.include("User does not exist");
    //     })
    //     .catch(function(error){

    //     });
    //     done();
    // });

    // test("Test login with invalid credentials", function(done){
    //     let app = server.app;
    //     let agent = chai.request.agent(app);

    //     agent
    //         .post('/login')
    //         .send({email: 'wrong@wrong.com', password: 'wrong'})
    //         .then(function (response){
    //             expect(response).to.have.cookie('userq_id');
    //             expect(response).to.redirectTo(/\/home5/);
    //         });
    //         agent.close();
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