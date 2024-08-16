if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cors = require('cors')
const express = require('express')
const app = express()
const routes = require('./routes')

require('./config/mongoose')
app.use(cors())
app.use(express.json())
app.use('/', routes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: {
      message: 'Internal Server Error'
    }
  })
})

app.listen(process.env.PORT, () => {
  console.log('App is running!')
})