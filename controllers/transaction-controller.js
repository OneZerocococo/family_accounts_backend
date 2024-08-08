const client = require('../config/mongodb')
const db = client.db()
const Transaction = db.collection('transactions')
const Categories = db.collection('categories')

const generateRandomId = () => {
  return Math.random().toString(36).substr(2, 12).toUpperCase()
};

const getCategories = async () => {
  const categories = await Categories.find().toArray()
  return categories
}

const transactionController = {
  getBalance: async (req, res) => {
    try {
      let endDate
      if (req.query.endDate) {
        const endDateStr = req.query.endDate;
        if (!/^\d{8}$/.test(endDateStr)) {
          return res.status(400).json({ error: 'Invalid endDate format. Expected YYYYMMDD.' });
        }

        const year = parseInt(endDateStr.substring(0, 4), 10);
        const month = parseInt(endDateStr.substring(4, 6), 10) - 1
        const day = parseInt(endDateStr.substring(6, 8), 10);

        endDate = new Date(Date.UTC(year, month, day, 16, 0, 0))
      } else {
        endDate = new Date();
        endDate.setUTCHours(16, 0, 0, 0)
      }

      const result = await Transaction.aggregate([
        {
          $match: {
            group_id: req.params.group_id,
            date: { $lte: endDate }
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: 'category_id',
            as: 'category_info'
          }
        },
        {
          $unwind: '$category_info'
        },
        {
          $addFields: {
            adjustedAmount: {
              $cond: {
                if: '$category_info.is_expense',
                then: { $multiply: ['$amount', -1] },
                else: '$amount'
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$adjustedAmount' }
          }
        }
      ]).toArray();

      const totalAmount = result.length > 0 ? result[0].totalAmount : 0;

      console.log('currentBalance: ', totalAmount);
      res.status(200).json({ balance: totalAmount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
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
      const transactions = await Transaction.aggregate([
        {
          $match: {
            group_id: req.params.group_id,
            date: { $gte: startOfMonth, $lt: endOfMonth }
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: 'category_id',
            as: 'category_info'
          }
        },
        {
          $unwind: '$category_info'
        },
        {
          $addFields: {
            category_name: '$category_info.name'
          }
        },
        {
          $project: {
            category_info: 0
          }
        }
      ]).toArray()

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