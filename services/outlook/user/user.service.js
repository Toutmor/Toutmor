const request = require('request-promise')

module.exports = {
  getUserPicture
}

function getUserPicture(token, cb) {
  const rqOptions = {
    uri: 'https://outlook.office.com/api/v2.0/me/photo/',
    method: 'GET',
    headers: {
      Authorization : 'Bearer ' + token.value
    },
    json: true
  }
  request(rqOptions)
    .then((parsedBody) => {
      console.log(parsedBody)
    })
    .catch(error => {console.error(error)})
}
