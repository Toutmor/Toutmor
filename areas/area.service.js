const Area = require('../utils/db').Area

module.exports = {
  getAll,
  update,
  delete: _delete
}

async function getAll() {
  try {
    return await Area.find()
  } catch (error) {
    throw error
  }
}

async function update(areaParams) {
  try {
    const actionArea = await Area.findOne({userId: areaParams.userId, actionName: areaParams.actionName})
    if (actionArea) {
      console.log('updated action')
      Object.assign(actionArea, areaParams)
      await actionArea.save()
      return actionArea
    }
    const triggerArea = await Area.findOne({userId: areaParams.userId, triggerName: areaParams.triggerName})
    if (triggerArea) {
      console.log('updated trigger')
      Object.assign(triggerArea, areaParams)
      await triggedArea.save()
      return reactionArea
    }
    console.log('created area')
    const newArea = new Area(areaParams)
    await newArea.save()
    return newArea

  } catch (error) {
    throw (error)
  }
}

async function _delete(areaId) {
  try {
    await Area.findByIdAndRemove(areaId)
  } catch (error) {
    throw (error)
  }
}
