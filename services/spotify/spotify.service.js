const spotifyWebApi = require('spotify-web-api-node')
const tokenService = require('../../tokens/token.service')

const spotifyApi = new spotifyWebApi()

//spotifyApi.setAccessToken('<your_access_token>')

module.exports = {
  getUser
}

function getUser(userId) {
  tokenService.getByType(userId, 'spotify')
    .then(token => {
      console.log('token value: ' + token.value)
    })
    .catch(error => console.error(error))
}
