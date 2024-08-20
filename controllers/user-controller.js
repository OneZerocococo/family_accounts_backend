const User = require('../models/user')

const userController = {
  login: async (req, res, next) => {
    try {
      const { userId } = req.body
      if (!userId) return res.status(400).json({
        error: {
          message: 'userId can not be empty'
        }
      })
      const user = await User.findOne({ id: userId }).select('-_id')
      if (!user) return res.status(401).json({
        error: {
          message: 'user not exist'
        }
      })
      res.status(200).json({ userData: user })
    } catch (error) {
      next(error)
    }
  },
  register: async (req, res, next) => {
    try {
      const { userId, username, profilePicUrl } = req.body
      if (!userId) return res.status(400).json({
        error: {
          message: 'userId can not be empty'
        }
      })
      const userData = {
        id: userId,
        username,
        profile_picture: profilePicUrl,
        membership_level: 'free_member',
        groups: []
      }
      const newUserDate = await User.create(userData)
      res.status(200).json(newUserDate)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController