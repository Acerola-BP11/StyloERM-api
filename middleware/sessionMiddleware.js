const Session = require("../models/Session")

async function sessionMiddleware(req, res, next){
    const sessionCookie = req.cookies.Session
    if(!sessionCookie){
        res.redirect('http://localhost:3000/login', 401)
        return
    }
    const session = await Session.findOne({token: sessionCookie.sessionToken, username: sessionCookie.username})
    if(!session){
        res.redirect('http://localhost:3000/login', 401)
        return
    }
    if(session.expiresAt < new Date()){
        res.redirect('http://localhost:3000/login', 401)
        return
    }
    next()
}

module.exports = sessionMiddleware