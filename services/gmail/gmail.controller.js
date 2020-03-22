const router = require('express').Router()

router.post('/push', getMails)

module.exports = router

function getMails(req, res, next) {
  console.log(req.body);
  res.status(200).send();
}