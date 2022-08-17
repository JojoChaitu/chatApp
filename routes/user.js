const express = require('express')
const router = express.Router()
const { signUp,userLogin,userLogout } = require('../controllers/user')
const { chatRoom } = require('../controllers/chat')
const authentication = require('../middleware/auth')


//User Routes
router.route('/signup').post(signUp)
router.route('/login').post(userLogin)
router.route('/chatroom').get(authentication,chatRoom)
router.route('/logout').get(userLogout)


module.exports = router
