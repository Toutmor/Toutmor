const router = require('express').Router()
const userService = require('./user.service')
const tokenService = require('../../../tokens/token.service')

router.get('/:userId', getPicture)

module.exports = router

function getPicture(req, res, next) {
  console.log('getPicture')
  tokenService.getByType(req.params.userId, 'outlook')
    .then(token => {
      if (!token) {
        console.log('no outlook token')
        return
      }
      userService.getUserPicture(token, (err) => {

      })
    })
}
