const router = require('express').Router()
const spotifyService = require('./spotify.service')


router.get('/:userId', getUser)

module.exports = router

function getUser(req, res, next) {
  console.log('getUser (spotify)')
  spotifyService.getUser(req.params.userId)
}
