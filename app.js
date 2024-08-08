if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cors = require('cors')
const express = require('express')
const app = express()

const transactionController = require('./controllers/transaction-controller')

app.use(cors())
app.use(express.json())
app.get('/categories', transactionController.getCategories)
app.get('/getBalance/:group_id', transactionController.getBalance)
app.get('/transactions/:group_id', transactionController.getTransactions)
app.delete('/transaction/:id', transactionController.removeOne)
app.post('/transaction', transactionController.createTransaction)

app.listen(process.env.PORT, () => {
  console.log('App is running!')
})