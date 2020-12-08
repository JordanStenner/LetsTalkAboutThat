async function setSession(request, username, email){
    try{
        request.session.username = username;
        request.session.email = email;
    } catch (err){
        console.log("Error is : ", err);
    }

}

async function endSession(request){
    try{
    request.session.destroy();
    } catch (err){
        console.log("Error is : " + err);
    }
}

module.exports.setSession = setSession;
module.exports.endSession = endSession;