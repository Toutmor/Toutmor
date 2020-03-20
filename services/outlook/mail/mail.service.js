const outlook = require('node-outlook')
const tokenService = require('../../../tokens/token.service')


module.exports = {
  getAll,
  sync
}

function getAll(userId) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
  tokenService.getByType(userId, 'outlook')
    .then(token => {
      const queryParams = {
        '$select': 'Subject,ReceivedDateTime,From',
        '$orderby': 'ReceivedDateTime desc',
        '$top': 20
      }
      outlook.mail.getMessages({token: token[0].value, odataParams: queryParams}, function(error, result) {
        if (error) {
          throw error
        }
        else if (result) {
          console.log('getMessages returned ' + result.value.length + ' messages.');
          result.value.forEach(function(message) {
            console.log('  Subject:', message.Subject);
            console.log('  Received:', message.ReceivedDateTime.toString());
            console.log('  From:', message.From ? message.From.EmailAddress.Name : 'EMPTY');
          });
        }
      })
    })
    .catch(error => console.error(error))
}

function sync(userId, cb) {
  console.log('??')
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
  console.log('!!')
  tokenService.getByType(userId, 'outlook')
    .then(outlookToken => {
      tokenService.getByType(userId, 'mail-deltatoken')
        .then(deltaToken => {
          if (!deltaToken[0]) {
            firstSync(outlookToken, function(deltaLink) {
              console.log('in callback: deltaLink: ' + deltaLink)
              const deltaTokenParams = {
                userId: userId,
                type: 'mail-deltatoken',
                value: deltaLink
              }
              tokenService.create(deltaTokenParams)
                .then(createdDeltaToken => {
                  otherSync(outlookToken[0], createdDeltaToken, function(newValue, values) {
                    tokenService.update(createdDeltaToken._id, {value: newValue})
                    cb(undefined, values)
                  })
                })
                .catch(error => cb(error, undefined))
            })
          }
        })
        .catch(error => cb(error, undefined))
    })
    .catch(error => cb(error, undefined))
}

function firstSync(outlookToken, cb) {
  const queryParams = {
    '$select': 'Subject,ReceivedDateTime,From,BodyPreview,IsRead',
    '$orderby': 'ReceivedDateTime desc'
  }
  const apiOptions = {
    token: outlookToken[0].value,
    odataParams: queryParams
  }
  outlook.mail.syncMessages(apiOptions, function(error, messages) {
    if (error)
      throw error
    console.log('firstSync: ' + JSON.stringify(messages))
    const nextLink = messages["@odata.nextLink"]
    if (nextLink !== undefined && nextLink.includes())
      console.log('ON EST LA')
    const deltaLink = messages["@odata.deltaLink"]
    if (deltaLink !== undefined && deltaLink.includes('deltatoken')) {
      console.log('firstsync deltatoken found')
      cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1))
    } else {
      cb('no deltalink')
    }
  })
}

function otherSync(outlookToken, deltaToken, cb) {
  const queryParams = {
    '$select': 'Subject,ReceivedDateTime,From,BodyPreview,IsRead',
    '$orderby': 'ReceivedDateTime desc'
  }
  const apiOptions = {
    token: outlookToken.value,
    odataParams: queryParams,
    deltaToken: deltaToken.value,
    pageSize: 20
  }
  outlook.mail.syncMessages(apiOptions, function(error, messages) {
    if (error)
      throw error
    console.log('otherSync: ' + JSON.stringify(messages))
    const values = messages['value']
    const deltaLink = messages["@odata.deltaLink"]
    if (deltaLink !== undefined && deltaLink.includes('deltatoken') && deltaLink.includes('deltatoken')) {
      cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1), values)
    } else {
      cb('no deltalink', values)
    }
  })
}
