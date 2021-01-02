let Chatroom_Logic = require("./static/scripts/chatroom_logic");
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

const port = process.env.PORT || 9000;
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
app.get("/posts/:topicname/:page", routes.posts);

app.post("/register", routes.register);
app.post("/login", routes.login);
app.get("/logout", routes.logout);
app.get("/chatroom/:postID/:username", routes.chatroom);
app.post("/createpost/:topicname", routes.createPost);


server.listen(port, function(){
    console.log("Listening on " + port);
});

let io = socketio(server);

io.on("connection", function(socket){
    const bot = "LTAT BOT";
    socket.emit("test", "User connected");

    socket.on("joinedRoom", function({username, postID}){
        let user = Chatroom_Logic.joinedUser(socket.id, username, postID);
        console.log(user.username + " Has joined the chat");

        socket.join(user.postID);

        socket.broadcast.to(user.postID).emit("sendMessage", Chatroom_Logic.formatMessageContent(bot, username + " has joined the discussion"));
    });

    socket.on("userMessage", function(message){
        const user = Chatroom_Logic.getUserFromSocket(socket.id);

        if(user){
            io.to(user.postID).emit("sendMessage", Chatroom_Logic.formatMessageContent(user.username, message));
        }
    });

    socket.on("disconnect", function(){
        let user = Chatroom_Logic.userDisconnect(socket.id);

        if(user){
            io.to(user.postID).emit("sendMessage", Chatroom_Logic.formatMessageContent(bot, user.username + " has left the discussion"));
        }
    });
});


module.exports.app = app;