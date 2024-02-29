const mongoose = require('mongoose')

const tempUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
       type: String,
       required: true
    },
    expiresAt: {
        type: Date,
        default: new Date() + 3600000
    }

})

const TempUser = mongoose.model('TempUser', tempUserSchema)

module.exports = TempUser