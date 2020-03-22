const router = require('express').Router()
const calendarService = require('./calendar.service')

router.get('/:userId', getAll)
router.get('/sync/:userId', sync)
router.get('/subscribe/:userId', subscribe)
router.get('/callback/me', subscribeCallback)
router.get('/callback/me/:token', subscribeCallbackTwo)
router.post('/callback/me', subscribeCallbackPost)
router.post('/callback/me/:token', subscribeCallbackTwoPost)

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

function subscribeCallback(req, res, next) {
  console.log('subscribeCallback (calendar)')
  res.status(200)
}

function subscribeCallbackTwo(req, res, next) {
  console.log('subscribeCallbackTwo (calendar)')
  res.status(200)
}

function subscribeCallbackPost(req, res, next) {
  console.log('subscribeCallbackPost (calendar)')
  res.status(200)
}

function subscribeCallbackTwoPost(req, res, next) {
  console.log('subscribeCallbackTwoPost (calendar)')
  res.status(200)
}
