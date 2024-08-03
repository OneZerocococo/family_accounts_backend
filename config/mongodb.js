if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const { MongoClient } = require('mongodb')
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

client.connect((err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Connected to MongoDB')
})

module.exports = client