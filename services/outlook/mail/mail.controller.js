const router = require('express').Router()
const mailService = require('./mail.service')

router.get('/:userId', getAll)
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

/*function sync(req, res, next) {
  mailService.sync(req.params.userId, function(error, events) {
    if (error) {
      console.error(error)
    }
    else {
      events.forEach((item) => {
        console.log(JSON.stringify(item))
      })
    }
  })
}*/
