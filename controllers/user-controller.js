const User = require('../models/user')

const userController = {
  login: async (req, res, next) => {
    try {
      const { userId } = req.body
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
  }
}

module.exports = userController