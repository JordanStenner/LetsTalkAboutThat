const form = document.querySelector(".chat-form");
const chatContent = document.querySelector(".chat-content");

const url = window.location.href;
const spliturl = url.split("/");

const username = spliturl[5];
const postID = spliturl[4];

let socket = io();

//Socket handler to send the actual message
socket.on("sendMessage", function(content){

    createMessageHTML(content);
    chatContent.scrollTop = chatContent.scrollHeight;
});

form.addEventListener("submit", event => {
    event.preventDefault()

    let messageContent = event.target.elements.message.value;
    let trimmedMessage = messageContent.trim();

    //Might not be needed as form does not allow empty messages to be sent
    if(!trimmedMessage){
        return false;
    }

    socket.emit("userMessage", trimmedMessage);

    //Clear the text box and focus on it
    event.target.elements.message.value = "";
    event.target.elements.message.focus();
});


/* Function for creating the message HTML code */
function createMessageHTML(content){
    //Create main div that will hold the sent message
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("content");
    if(content.username == "LTAT BOT"){
        mainDiv.classList.add("bot")
    }
    else{
        mainDiv.classList.add("user")
    }
    
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
