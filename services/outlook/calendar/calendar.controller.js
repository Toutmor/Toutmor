const router = require('express').Router()
const calendarService = require('./calendar.service')
const areaService = require('../../../areas/area.service')
const timer = require('../../timer')

router.get('/:userId', getAll)
router.get('/sync/:userId', sync)
router.get('/subscribe/:userId', subscribe)
router.post('/callback/calendarCreate', subscribeCallbackCreate)
router.post('/callback/calendarDelete', subscribeCallbackDelete)
router.post('/callback/calendarUpdate', subscribeCallbackUpdate)
router.post('/callback/me', uselessFunction)

module.exports = router

function getAll(req, res, next) {
  console.log('getAll (calendar)')
  calendarService.getAll(req.params.userId)
}

function sync(req, res, next) {
  console.log('sync (calendar)')

    calendarService.sync(req.params.userId, (values => {
      values.forEach((item, index) => {
        console.log('finally reason in value at index ' + index + ' : ' + item.reason)
        console.log(item)
        if (item.LastModifiedDateTime)
          console.log('changed ?')
      })
    }))
}

function subscribe(req, res, next) {
  console.log('subscribe (calendar)')
  calendarService.subscribe(req.params.userId)
}

function subscribeCallbackCreate(req, res, next) {
  console.log('subscribeCallbackCreate (calendar)')
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
    areaService.getByArray('calendarCreate', [id])
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
  console.log('subscribeCallbackDelete (calendar)')
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
    areaService.getByArray('calendarDelete', [id])
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
  console.log('subscribeCallbackUpdate (calendar)')
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
    areaService.getByArray('calendarUpdate', [id])
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

function uselessFunction(req, res, next) {
  console.log('uselessFunction called')
  res.status(200).send()
}
