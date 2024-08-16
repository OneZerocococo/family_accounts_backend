const transactionController = require('../../controllers/transaction-controller')
const express = require('express')
const router = express.Router()

router.get('/:groupId', transactionController.getTransactionsByGroup)
router.get('/getBalance/:groupId', transactionController.getBalance)
router.patch('/:id', transactionController.updateTransaction)
router.post('/', transactionController.addOneTransaction)
router.delete('/', transactionController.deleteTransactions)




module.exports = router