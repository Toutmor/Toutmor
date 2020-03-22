const router = require('express').Router()
const areaService = require('./area.service')

router.post('/update', update)
router.delete('/:areaId', _delete)
router.get('/getAll/:userId', getAll)

module.exports = router

function getAll(req, res, next) {
  console.log('getAll (area)')
  areaService.getTest(req.params.userId)
    .then(areas => res.json(areas))
    .catch(error => next(error))
}

function update(req, res, next) {
  console.log('update (area)')
  areaService.update(req.body)
    .then(area => res.json(area))
    .catch(error => next(error))
}

function _delete(req, res, next) {
  console.log('delete (area)')
  areaService.delete(req.params.areaId)
    .then(() => res.json({}))
    .catch(error => next(error))
}
