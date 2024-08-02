require('dotenv').config()
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('hello123')
})

app.listen(process.env.PORT, () => {
  console.log('App is running!')
})