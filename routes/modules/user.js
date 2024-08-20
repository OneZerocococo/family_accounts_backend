const userController = require('../../controllers/user-controller')
const express = require('express')
const router = express.Router()

router.post('/login', userController.login)
router.post('/register', userController.register)
module.exports = router