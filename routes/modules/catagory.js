const categoryController = require('../../controllers/category-controller')
const express = require('express')
const router = express.Router()

router.get('/', categoryController.getCategories)
module.exports = router