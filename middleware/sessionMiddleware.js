const Session = require("../models/Session")

async function sessionMiddleware(req, res, next){
    
    const authorizationHeader = req.headers['authorization']
    
    if(!authorizationHeader){
        res.status(401)
        return
    }

    const token = authorizationHeader

    const session = await Session.findOne({token})
    if(!session || session.expiresAt < new Date()){
        res.status(401)
        return
    }
    next()
}

module.exports = sessionMiddleware