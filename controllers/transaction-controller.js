const Transaction = require('../models/transaction')
const generateRandomId = () => {
  return Math.random().toString(36).slice(2, 14).toUpperCase()
}

const transactionController = {
  getTransactionsByGroup: async (req, res, next) => {
    try {
      const { groupId } = req.params
      const { startDate, endDate } = req.query
      if (!startDate || !endDate || !groupId) return res.status(400).json({
        error: {
          message: 'startDate, endDate, and groupId are required fields'
        }
      })
      if (startDate > endDate) return res.staus(400).json({
        error: {
          message: 'startDate must be earlier than endDate'
        }
      })
      const transactions = await Transaction.find({
        group_id: groupId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) }
      })
        .select('-_id')
        .sort({ date: 1 })
        .lean()

      return res.status(200).json(transactions)
    } catch (error) {
      next(error)
    }
  },
  addOneTransaction: async (req, res, next) => {
    try {
      const { category, description, date, groupId, amount, imgUrl } = req.body
      if ( !category || !description || !date || !groupId || !amount ) {
        return res.status(400).json({
          error: {
            message: 'category, description, date, groupId, amount are required fields'
          }
        })
      }
      const newTransaction = await Transaction.create({
        id: 'T' + generateRandomId(),
        category,
        description,
        date: new Date(date),
        group_id: groupId,
        amount,
        img_url: imgUrl
      })
      return res.status(200).json({ transaction: newTransaction })
    } catch (error) {
      next(error)
    }
  },
  updateTransaction: async (req, res, next) => {
    try {
      const transactionId = req.params.id
      const { date, imgUrl, category, amount, description } = req.body
      if (!transactionId || !category || !description || !date || !amount) {
        return res.status(400).json({
          error: {
            message: 'category, description, date, amount are required fields'
          }
        })
      }
      const updatedResult = await Transaction.updateOne(
        { 
          id: transactionId 
        },
        {
          $set: {
            category,
            description,
            date: new Date(date),
            amount,
            img_url: imgUrl
          }
        }
      )
      if (updatedResult.matchedCount < 1) {
        return res.status(404).json({
          error: {
            message: 'Transaction not found'
          }
        })
      } else if (updatedResult.modifiedCount < 1) {
        return res.status(200).json({ result: 'failed', message: "No changes were made" })
      }
      const updatedTransaction = await Transaction.findOne({ id: transactionId })
      return res.status(200).json({ transaction: updatedTransaction })
    } catch (error) {
      next(error)
    }
  },
  deleteTransactions: async (req, res, next) => {
    try {
      const { transactionIds } = req.body
      if (!transactionIds || transactionIds.length < 1) {
        return res.status(400).json({
          error: {
            message: 'transactionIds can not be empty'
          }
        })
      }
        const deleteResult = await Transaction.deleteMany({
        id: {
          $in: transactionIds
        }
      })
      console.log(deleteResult)
      if (deleteResult.deletedCount >= 1) {
        return res.status(200).json({ result: 'success', message: `Deleted ${deleteResult.deletedCount} transactions` })
      }
      return res.status(404).json({ result: 'failed', message: 'Document not found' })
    } catch (error) {
      next(error)
    }
  },
  getBalance: async (req, res, next) => {
    try {
      const { endDate } = req.query
      const result = await Transaction.aggregate([
        {
          $match: {
            group_id: req.params.groupId,
            date: { $lte: new Date(endDate) }
          }
        },
        {
          $addFields: {
            adjustedAmount: {
              $cond: {
                if: { $eq: ["$category.is_expense", true] },
                then: { $multiply: ["$amount", -1] },
                else: "$amount"
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$adjustedAmount" }
          }
        }
      ])

      const totalAmount = result.length > 0 ? result[0].totalAmount : 0
      return res.status(200).json({ balance: totalAmount })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = transactionController