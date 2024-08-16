const category = require('./modules/catagory')
const transaction = require('./modules/transaction')
const express = require('express')
const router = express.Router()

router.use('/categories', category)
router.use('/transactions', transaction)

module.exports = router