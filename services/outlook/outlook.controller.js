const express = require('express')
const router = express.Router()

router.use('/calendar', require('./calendar/calendar.controller'))
router.use('/mail', require('./mail/mail.controller'))
router.use('/user', require('./user/user.controller'))

module.exports = router
