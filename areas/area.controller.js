const router = require('express').Router()
const areaService = require('./area.service')

router.post('/update', update)
router.delete('/:areaId', _delete)

module.exports = router

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
