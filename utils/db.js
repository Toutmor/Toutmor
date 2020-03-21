const mongoose = require('mongoose')

console.log('mongoconnect: ' + process.env.mongo)
mongoose.connect("mongodb+srv://mathis:" +
                  encodeURIComponent('96!b=Zcde#5?2*i') +
                  "@cluster0-vfmna.gcp.mongodb.net/test?retryWrites=true&w=majority",
                  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true},
                  function(err, db) {
  if (err) {
    console.error('Error connecting mongoDB cluster: ' + err.message)
    process.exit(1)
  } else {
    console.log('mongoose connect successfull')
  }
})
mongoose.Promise = global.Promise

module.exports = {
  User: require('../users/user.model'),
  Token: require('../tokens/token.model'),
  Area: require('../areas/area.model')
}
