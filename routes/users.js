var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController')

router.post('/', userController.createUser);
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.post('/confirmRegistration/:tempUserId', userController.validateEmail)

module.exports = router;
