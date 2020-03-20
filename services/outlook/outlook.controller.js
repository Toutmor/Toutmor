const express = require('express')
const router = express.Router()

router.use('/calendar', require('./calendar/calendar.controller'))
router.use('/mail', require('./mail/mail.controller'))

module.exports = router
