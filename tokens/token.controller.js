const express = require('express')
const router = express.Router()
const tokenService = require('./token.service')

router.get('/:userId', getAll)
router.get('/:userId/:type', getByType)
router.post('/create', create)
router.put('/:tokenId', update)
router.delete('/:tokenId', _delete)

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

function create(req, res, next) {
  console.log('create (token)')
  tokenService.create(req.body)
    .then(token => res.json(token))
    .catch(err => next(err))
}

function update(req, res, next) {
  console.log('update (token)')
  tokenService.update(req.params.tokenId)
    .then(() => res.json({}))
    .catch(err => next(err))
}

function _delete(req, res, next) {
  console.log('delete (token)')
  tokenService.delete(req.params.tokenId)
    .then(() => res.json({}))
    .catch(err => next(err))
}
