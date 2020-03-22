const mongoose = require('mongoose')
const Schema = mongoose.Schema

const areaModel = new Schema({
  userId: {
    type: String,
    required: true
  },
  actionName: {
    type: String,
    required: true
  },
  triggerName: {
    type: String,
    required: true
  },
  prevState: {
    type: Boolean,
    default: true
  },
  type: {
    type: Number,
    default: 0
  },
  tokenTarget: {
    type: String,
    required: true
  },
  actionParams: [],
  triggerParams: []
})

areaModel.set('toJSON', {virtuals:true})

module.exports = mongoose.model('AreaModel', areaModel)
