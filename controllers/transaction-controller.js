const client = require('../config/mongodb')
const db = client.db()
const Transaction = db.collection('transactions')

const transactionController = {
  getTransactions: async (req, res) => {
    try {
      // 預設撈當月
      const now = new Date()
      const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, -8, 0, 0))
      const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, -8, 0, 0))
      const transactions = await Transaction.find({ 
        group_id: req.params.group_id,
        time: { $gte: startOfMonth, $lt: endOfMonth }
       }).toArray()
      console.log('transactions: ', transactions)
      res.status(200).json(transactions)
    } catch (error) {
      console.error(error)
    }
  },
  removeOne: async (req, res) => {
    try {
      const transactionId = req.params.id;

      if (!transactionId || typeof transactionId !== 'string') {
        return res.status(400).json({ result: 'failed', message: 'Invalid transaction_id format' });
      }

      const result = await Transaction.deleteOne({ id: transactionId });

      if (result.deletedCount === 1) {
        return res.status(200).json({ result: 'success' });
      }

      return res.status(404).json({ result: 'failed', message: 'Document not found' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ result: 'error', message: error.message });
    }
  } 
}

module.exports = transactionController