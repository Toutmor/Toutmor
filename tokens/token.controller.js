const express = require('express')
const router = express.Router()
const tokenService = require('./token.service')
const request = require('request-promise')

router.get('/:userId', getAll)
router.get('/:userId/:type', getByType)
router.post('/update', update)
router.delete('/:tokenId', _delete)
router.post('/linkedintmp', linkedintmp)
router.get('/linkedintmp/redirect', linkedintmpRedirect)

module.exports = router

function getAll(req, res, next) {
  console.log('getAll (token)')
  tokenService.getAll(req.params.userId)
    .then(tokens => res.json(tokens))
    .catch(err => next(err))
}

function getByType(req, res, next) {
  console.log('getByType (token)')
  tokenService.getByType(req.params.userId, req.params.type)
    .then(token => res.json(token))
    .catch(err => next(err))
}

function update(req, res, next) {
  console.log('update (token)')
  tokenService.update(req.body)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function _delete(req, res, next) {
  console.log('delete (token)')
  tokenService.delete(req.params.tokenId)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function linkedintmp(req, res, next) {
  console.log('linkedintmp : ' + req.body)
  console.log('=> ' + req.body.code + ' and ' + req.body.id)
  const rqOptions = {
    uri: "https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=" + req.body.code + "&redirect_uri=http://localhost:3000/home&client_id=86b2rs5pz6iimw&client_secret=yEEmAASnjsoo7kFW",
    method: "POST",
    json: true
  }
  request(rqOptions)
    .then(bodyParsed => {
      console.log(bodyParsed)
      tokenService.update({userId: req.body.id, type: 'linkedin', value: bodyParsed.access_token})
      res.status(200).json({message: 'ok'})
    })
    .catch(error => {
      console.error(error.message)
      res.status(500).json({message: 'error'})
    })
}

function linkedintmpRedirect(req, res, next) {
  console.log('redirect linkedin')
}
