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

    createMessageHTML(content);
    document.querySelector(".chat-content").scrollTop = document.querySelector(".chat-content").scrollHeight;
});

function createMessageHTML(content){
    //Create main div that will hold the sent message
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("content");
    
    //Create a paragraph element to hold the username and time of message
    const userTags =  document.createElement("p");
    userTags.classList.add("meta");
    userTags.innerText = content.username;
    userTags.innerHTML += "<span id='message-time'>" + content.time + "</span>";
    mainDiv.appendChild(userTags);

    const inputMessage = document.createElement("p");
    inputMessage.classList.add("text");
    inputMessage.innerText = content.content;
    mainDiv.appendChild(inputMessage);

    document.querySelector(".chat-content").appendChild(mainDiv);


}

socket.emit("joinedRoom", {username, postID});
