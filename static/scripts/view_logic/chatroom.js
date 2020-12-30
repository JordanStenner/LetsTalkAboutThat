$(function(){
    let socket = io("http://localhost:9000");

    socket.on("test", function(msg){
        console.log(msg);
    });
});