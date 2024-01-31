const uuid = require('uuid')
const User = require("../models/UserModel")
const Session = require('../models/Session')
const TempUser = require('../models/TempUserModel')
const sendMail = require('../utils/mail')

const createUser = async (req, res) => {
    const { email, username, password } = req.body
    if (await User.findOne({ email })) {
        res.status(200).send('Este e-mail já está cadastrado')
        return
    }
    if (await TempUser.findOne({ email })) {
        TempUser.deleteMany({ email })
    }
    const user = await TempUser.create({ email: email, username: username, password: password })
    await sendMail(username, email, user._id)
    res.status(200).json({ msg: 'Úsuario criado com sucesso!' })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const userData = await User.findOne({ email: email, password: password })
    if (userData) {
        await Session.deleteMany({ email: email })
        const sessionToken = uuid.v4()
        const now = new Date()
        const expiresAt = new Date(+now + 24 * 1000 * 60 * 60)
        const session = { email: userData.email, username: userData.username, token: sessionToken, expiresAt: expiresAt }
        await Session.create(session)
        res.status(200).cookie("Session", { sessionToken: sessionToken, username: userData.username }, { sameSite: 'None', secure: true },
            { expiresAt: expiresAt }).send(`Bem vindo ${userData.username}`)
    } else {
        res.status(401).send()
    }
}

const logout = async (req, res) => {
    if (!req.cookies.Session) {
        res.status(401).end()
        return
    }

    const sessionToken = req.cookies.Session.sessionToken
    if (!sessionToken) {
        res.status(401).end()
        return
    }
    await Session.deleteMany({ token: sessionToken })
        .catch(e => console.log('Error'))

    res.cookie("Session", "", { expires: new Date() })
    res.end()
}

const validateEmail = async (req, res) => {

    try {
        const tempUserId = req.params.tempUserId
        const tempUser = await TempUser.findById(tempUserId)
        console.log(tempUserId, tempUser)
        if (!tempUser) {
            res.status(404).send('Ocorreu um erro com a requisição!')
            return
        }

        const { email, username, password, expiresAt } = tempUser

        if (expiresAt > new Date()) {
            await TempUser.deleteOne({ _id: tempUserId })
            res.status(200).send('O Link encontra-se expirado!')
            return
        }

        await User.create({ email, username, password })
        await TempUser.deleteOne({ _id: tempUserId })
        req.body = {
            email,
            password
        }
        await login(req, res)
    } catch (error) {
        res.status(500).send('Ocorreu um erro ao validar o úsuario')
    }
}

module.exports = {
    createUser, login, logout, validateEmail
}