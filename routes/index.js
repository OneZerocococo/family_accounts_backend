const category = require('./modules/catagory')
const transaction = require('./modules/transaction')
const user = require('./modules/user')
const express = require('express')
const router = express.Router()

router.use('/user', user)
router.use('/categories', category)
router.use('/transactions', transaction)
router.get('/ping', (req, res) => {
  res.send('Server is awake.');
})

module.exports = router