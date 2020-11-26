let express = require("express");
let path = require("path");

let app = express();
let port = 9000;

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");

app.get("/", function(request, response){
    response.render("landing");
});

app.get("/createaccount", function(request, response){
    response.render("createaccount");
});

app.listen(port, function(){
    console.log("Listening on " + port);
});