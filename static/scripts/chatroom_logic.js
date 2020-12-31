const users = [];

function joinedUser(socketID, username, postID){
    const user = {socketID, username, postID};

    users.push(user);
    return user;
}

function formatMessageContent(username, content){
    time = getTime();
    return {
        username, 
        content,
        time
    }
}

function getTime(){
    let d = new Date;
    let date = ('0' + d.getHours()).slice(-2) + ":" + 
               ('0' + d.getMinutes()).slice(-2) + ":" + 
               (d.getHours() < 12 ? 'AM' : 'PM');
    return date.toString();
}

module.exports.joinedUser = joinedUser;
module.exports.getTime = getTime;
module.exports.formatMessageContent = formatMessageContent;