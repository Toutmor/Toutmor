const Area = require('../utils/db').Area
const gmailService = require('../services/gmail/gmail.service')

module.exports = {
  getAll,
  getTest,
  getByArray,
  update,
  delete: _delete
}

var unsub = {"incgmail": gmailService.unsubscribe}

async function getAll() {
  try {
    return await Area.find()
  } catch (error) {
    throw error
  }
}

async function getTest(userId) {
  try {
    return await Area.find({userId: userId})
  } catch (error) {
    throw error
  }
}

async function getByArray(triggerName, arrayValue) {
  try {
    console.log('=> ' + triggerName)
    console.log('and ' + arrayValue)
    return await Area.find({triggerName: triggerName, triggerParams: arrayValue})
  } catch (error) {
    throw error
  }
}

async function update(areaParams) {
  try {
    if (areaParams._id) {
      const area = await Area.findOne({_id: areaParams._id})
      Object.assign(area, areaParams)
      await area.save()
      console.log('=> updated')
      return area
    }
    const area = new Area(areaParams)
    await area.save()
    console.log('=> created')
    return area
  } catch (error) {
    throw (error)
  }
}

async function _delete(areaId) {
  try {
    const area = await Area.findById(areaId);
    if (area.type != 0)
      unsub[area.triggerName](area);
    await area.remove();
  } catch (error) {
    throw (error)
  }
}
