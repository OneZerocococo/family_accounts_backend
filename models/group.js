const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
const Schema = mongoose.Schema
const groupSchema = new Schema({
  id: {
    type: String,
    required: true,
    default: uuidv4
  },
  name: {
    type: String,
    required: true
  },
  members_count: {
    type: Number,
    required: true,
    default: 1
  },
  owner_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    required: true,
    default: 'active'
  },
  avatar_url: {
    type: String
  },
  permissions: {
    write: {
      type: Boolean,
      default: true
    },
    delete: {
      type: Boolean,
      default: false
    },
    manage_members: {
      type: Boolean,
      default: true
    },
    manage_permissions: {
      type: Boolean,
      default: false
    },
    manage_settings: {
      type: Boolean,
      default: true
    }
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

module.exports = mongoose.model('Group', groupSchema)