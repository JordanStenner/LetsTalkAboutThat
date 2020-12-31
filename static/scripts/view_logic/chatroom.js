const form = document.getElementById("chat-form");
const chatContent = document.querySelector(".chat-messages");


const url = window.location.href;
const spliturl = url.split("/");

const username = spliturl[5];
const postID = spliturl[4];

let socket = io("http://localhost:9000");

socket.on("test", function(msg){
    console.log(msg);
});

socket.on("sendMessage", function(content){
    console.log(content);
    //console.log("test success");
});

socket.emit("joinedRoom", {username, postID});
