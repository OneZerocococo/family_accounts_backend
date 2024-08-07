const client = require('../config/mongodb')
const db = client.db()
const Transaction = db.collection('transactions')

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 12).toUpperCase(); // 生成 12 位隨機 ID
};

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      const { date, group_id, img, category_id, amount, description } = req.body;

      if (!date || !group_id || !img || !category_id || !amount || !description) {
        return res.status(400).json({ result: 'failed', message: 'Missing required fields' });
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ result: 'failed', message: 'Invalid date format' });
      }

      const id = generateRandomId();

      const newTransaction = {
        date: parsedDate,
        group_id,
        img,
        category_id,
        amount,
        id,
        description,
      };

      const result = await Transaction.insertOne(newTransaction);
      if (result.acknowledged) {
        const insertedDoc = await Transaction.findOne({ _id: result.insertedId });
        return res.status(201).json({ result: 'success', data: insertedDoc });
      }
      return res.status(500).json({ result: 'failed', message: 'Failed to insert document' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ result: 'error', message: error.message });
    }
  },
  getTransactions: async (req, res) => {
    try {
      const now = new Date()
      const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, -8, 0, 0))
      const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, -8, 0, 0))
      const transactions = await Transaction.find({ 
        group_id: req.params.group_id,
        date: { $gte: startOfMonth, $lt: endOfMonth }
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