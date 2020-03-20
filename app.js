const express = require('express')
const cors = require('cors')
const errorHandler = require('./utils/error_handler')
const bodyParser = require('body-parser')

const dotenv = require('dotenv')
dotenv.config()

const jwt = require('./utils/jwt')

app = express()
app.use(errorHandler)
app.use(jwt())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use('/users', require('./users/user.controller'))
app.use('/tokens', require('./tokens/token.controller'))
app.use('/services', require('./services/service.controller'))

app.listen(process.env.PORT, function() {
  console.log('listening on port:' + process.env.PORT)
})
