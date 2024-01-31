const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    email: String,
    username: String,
    token: String,
    expiresAt: Date
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session