const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  id: {
    type: Schema.Types.UUID,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  profile_picture: {
    type: String
  },
  membership_level: {
    type: String,
    required: true
  },
  groups: {
    type: [
      {
        gorup_id: {
          type: String,
          required: true,
          ref: 'Group'
        },
        role: {
          type: String,
          required: true
        }
      }
    ]
  }
})

module.exports = mongoose.model('User', userSchema)