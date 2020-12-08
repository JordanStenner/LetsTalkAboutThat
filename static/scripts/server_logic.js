async function setSession(request, username, email){
    request.session.username = username;
    request.session.email = email;
}

module.exports.setSession = setSession;