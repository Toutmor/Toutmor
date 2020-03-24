const tokenService = require('../../tokens/token.service')
const request = require('request-promise')

module.exports = {
  share
}

function share(area) {
  console.log('share linkedin')
  tokenService.getByType(area.userId, 'linkedin')
    .then(token => {
      if (!token) {
        console.error('no linkedin token')
        return
      }
      const rqOptions = {
        uri: 'https://api.linkedin.com/v2/me',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token.value
        },
        json: true
      }
      console.log(token.value)
      request(rqOptions)
        .then(parsedBody => {
          console.log(JSON.stringify(parsedBody))
          URNid = parsedBody.id
          console.log(URNid)
          const newRqOptions = {
            uri: 'https://api.linkedin.com/v2/ugcPosts',
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token.value
            },
            body: {
              author: "urn:li:person:" + URNid,
              lifecycleState: "PUBLISHED",
              specificContent: {
                  "com.linkedin.ugc.ShareContent": {
                      "shareCommentary": {
                          "text": "Hello World! This is my first Share on LinkedIn!"
                      },
                      "shareMediaCategory": "NONE"
                  }
              },
              visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
              },
            },
            json: true
          }
          request(newRqOptions)
            .then(parsedBody => {
              console.log(pasedBody)
            })
            .catch(error => console.error(error.message))
        })
        .catch(error => console.error(error.message))
    })
    .catch(error => console.error(error.message))
}
