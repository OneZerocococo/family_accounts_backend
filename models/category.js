const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  is_expense: {
    type: Boolean,
    required: true,
    default: true
  },
  icon: {
    type: String
  }
})

module.exports = mongoose.model('Category', categorySchema)