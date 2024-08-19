const Category = require('../models/category')

const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.find().select('-_id').lean()
      res.status(200).json(categories)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = categoryController