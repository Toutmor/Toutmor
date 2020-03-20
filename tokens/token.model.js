const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenModel = new Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  expireAt : {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 1)
  },
  expired: {
    type: Boolean,
    default: false
  }
})

tokenModel.set('toJSON', {virtuals: true})

module.exports = mongoose.model('TokenModel', tokenModel)
