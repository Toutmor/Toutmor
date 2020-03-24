const router = require('express').Router()
const base64url = require('base64url');
const areaService = require('../../areas/area.service');
const timer = require('../timer')

router.post('/push', getMails)
module.exports = router

function getMails(req, res, next) {
  res.status(200).send();
  areaService.getByArray('incgmail', [JSON.parse(base64url.decode(req.data)).emailAddress]).then(array => {
    array.forEach(element => {
      timer.react_to(true, element);
    });
  }).catch(error => console.error(error));
}