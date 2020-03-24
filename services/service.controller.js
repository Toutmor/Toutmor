const router = require('express').Router()

router.use('/outlook', require('./outlook/outlook.controller'))
router.use('/spotify', require('./spotify/spotify.controller'))
router.use('/gmail', require('./gmail/gmail.controller'))
router.use('/linkedin', require('./linkedin/linkedin.controller'))

module.exports = router
