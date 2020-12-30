let routes = require("./routes");

var express = require("express");
var session = require("express-session");
var mongoose = require("mongoose");
var socketio = require("socket.io");
var path = require("path");
var http = require("http");

//let url = "mongodb://localhost:27017/LetsTalkAboutThat";
let url = "mongodb+srv://JordanStenner:LTATDB@letstalkaboutthat.imvzx.mongodb.net/LetsTalkAboutThat?retryWrites=true&w=majority"
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

const port = 9000;
let app = express();
let server = http.createServer(app);


app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.use(session({     
    key: 'user_id',
    secret: 'SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    } 
}));

app.get("/", routes.loadLanding);
app.get("/createaccount", routes.createAccount);
app.get("/home", routes.homepage);
app.get("/posts/:topicname", routes.posts);

app.post("/register", routes.register);
app.post("/login", routes.login);
app.get("/logout", routes.logout);

app.post("/createpost/:topicname", routes.createPost);


server.listen(port, function(){
    console.log("Listening on " + port);
});

let io = socketio(server);

io.on("connection", function(socket){
    socket.emit("test", "User connected");
});


module.exports.app = app;