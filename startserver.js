let routes = require("./routes");

let express = require("express");
var session = require("express-session");
let mongoose = require("mongoose");
let path = require("path");

let url = "mongodb://localhost:27017/LetsTalkAboutThat";
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});

let app = express();
let port = 9000;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

app.use(session({     
    key: 'user_id',
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    } 
}));

app.get("/", routes.loadLanding);
app.get("/createaccount", routes.createAccount);
app.get("/home", routes.homepage);

app.post("/register", routes.register);
app.post("/login", routes.login);
app.get("/logout", routes.logout);


app.listen(port, function(){
    console.log("Listening on " + port);
});