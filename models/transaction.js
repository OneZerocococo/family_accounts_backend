const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const Schema = mongoose.Schema
const transactionSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4
  },
  category: {
    id: {
      type: String,
      required: true,
      ref: 'Category'
    },
    name: {
      type: String,
      required: true,
    },
    is_expense: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  img_url: {
    type: String
  },
  group_id: {
    type: String,
    required: true,
    ref: 'Group'
  },
  amount: {
    type: Number,
    required: true
  },
  is_settled: {
    type: Boolean,
    required: true,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

groupSchema.pre('save', function (next) {
  this.set({ updated_at: Date.now() })
  next()
})

groupSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: Date.now() })
  next()
})

module.exports = mongoose.model('Transaction', transactionSchema)