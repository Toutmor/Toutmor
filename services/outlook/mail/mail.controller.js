const router = require('express').Router()
const mailService = require('./mail.service')
const timer = require('../../timer')
const areaService = require('../../../areas/area.service')

router.get('/:userId', getAll)
router.post('/callback/mailCreate', subscribeCallbackCreate)
router.post('/callback/mailDelete', subscribeCallbackDelete)
router.post('/callback/mailUpdate', subscribeCallbackUpdate)
//router.get('/sync/:userId', sync)

module.exports = router

function getAll(req, res, next) {
  mailService.getAll(req.params.userId, (error, value) => {
    if (error) {
      console.error(error)
    }
    else {
      console.log('should say something: ' + value)
    }
  })
}

function subscribeCallbackCreate(req, res, next) {
  console.log('subscribeCallbackCreate (mail)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  //res.status(202).send(http.STATUS_CODES[202])
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('mailCreate', [id])
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
  console.log('subscribeCallbackDelete (mail)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  //res.status(202).send(http.STATUS_CODES[202])
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('mailDelete', [id])
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
  console.log('subscribeCallbackUpdate (mail)')
  if (req.query.validationtoken) {
    console.log('send: validationtoken')
    res.status(200).send(req.query.validationtoken)
    return
  }
  console.log('send: ok')
  //res.status(202).send(http.STATUS_CODES[202])
  res.status(200).send()
  if (req.body && req.body.value) {
    const id = req.body.value[0].SubscriptionId
    console.log("deeper: " + id)
    areaService.getByArray('mailUpdate', [id])
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
