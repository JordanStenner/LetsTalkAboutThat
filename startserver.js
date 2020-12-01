let routes = require("./routes");

let express = require("express");
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

app.get("/", routes.loadHomepage);
app.get("/createaccount", routes.createAccount);
app.post("/register", routes.register);

app.listen(port, function(){
    console.log("Listening on " + port);
});