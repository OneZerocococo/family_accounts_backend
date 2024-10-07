const axios = require('axios')
const User = require('../models/user')

async function verifyLineAccessToken (lineAccessToken) {
  try {
    const verifyTokenResult = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${lineAccessToken}`)
    if (response.status === 200) {
      return verifyTokenResult.client_id === process.env.CHANNEL_ID && verifyTokenResult.expires_in > 0
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

async function getLineUserProfile (lineAccessToken) {
  try {
    const profile = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${lineAccessToken}`
      }
    })
    return profile
  } catch (error) {
    console.error(error)
  }
}

const userController = {
  login: async (req, res, next) => {
    try {
      const { lineAccessToken } = req.body
      if (!lineAccessToken) return res.status(400).json({
        error: {
          message: 'Miss lineAccessToken!'
        }
      })
      const isTokenValid = await verifyLineAccessToken(lineAccessToken)
      if (!isTokenValid) {
        return res.status(400).json({
          error: {
            message: 'The token is invalid!'
          }
        })
      } else {
        const lineUserProfile = await getLineUserProfile(lineAccessToken)
        const user = await User.findOne({ id: lineUserProfile.userId }).select('-_id')
        if (!user) return res.status(401).json({
          error: {
            message: 'user not exist'
          }
        })
        res.status(200).json({ userData: user })
      }
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