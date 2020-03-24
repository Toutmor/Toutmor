const router = require('express').Router()
const linkedinService = require('./linkedin.service')

router.get('/', share)

module.exports = router

function share(req, res, next) {
  const areaTmp = {
    userId: '5e727ac2e696263f897645ec',
    actionName: 'share',
    triggerName: 'undefined',
    tokenTarget: 'undefined'
  }
  linkedinService.share(areaTmp)
}
