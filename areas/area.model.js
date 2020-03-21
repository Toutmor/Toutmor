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
    type: Boolean
  }
})

areaModel.set('toJSON', {virtuals:true})

module.exports = mongoose.model('AreaModel', areaModel)
