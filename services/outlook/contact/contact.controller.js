const router = require('express').Router()
const timer = require('../../timer')
const areaService = require('../../../areas/area.service')

router.post('/callback/mailCreate', subscribeCallbackCreate)
router.post('/callback/mailDelete', subscribeCallbackDelete)
router.post('/callback/mailUpdate', subscribeCallbackUpdate)

module.exports = router

function subscribeCallbackCreate(req, res, next) {
  console.log('subscribeCallbackCreate (contatcs)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('contactCreate', [id])
      .then(area => {
        if (!area) {
          console.error('area not found')
        }
        console.log('area found')
        area.forEach((item) => {
          timer.react_to(true, item)
        })
      })
      .catch(error => console.error(error.message))
  }
}

function subscribeCallbackDelete(req, res, next) {
  console.log('subscribeCallbackDelete (contatcs)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('contactDelete', [id])
      .then(area => {
        if (!area) {
          console.error('area not found')
        }
        console.log('area found')
        area.forEach((item) => {
          timer.react_to(true, item)
        })
      })
      .catch(error => console.error(error.message))
  }
}

function subscribeCallbackUpdate(req, res, next) {
  console.log('subscribeCallbackUpdate (contatcs)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('contactUpdate', [id])
      .then(area => {
        if (!area) {
          console.error('area not found')
        }
        console.log('area found')
        area.forEach((item) => {
          timer.react_to(true, item)
        })
      })
      .catch(error => console.error(error.message))
  }
}
