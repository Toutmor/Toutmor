const request = require('request-promise')
const outlook = require('node-outlook')
const tokenService = require('../../../tokens/token.service')


module.exports = {
  getAll
  //sync
}

function getAll(token, cb) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')

  const queryParams = {
      '$select': 'Subject,ReceivedDateTime,From',
      '$filter': 'isRead eq false',
      '$orderby': 'ReceivedDateTime desc',
      '$top': 20
    }
    outlook.mail.getMessages({token: token.value, odataParams: queryParams, folderId: 'Inbox'}, function(error, result) {
      if (error) {
        return;
      }
      else if (result) {
        if (result.value.length === 0) {
          cb(false, )
        }
        else {
          tokenService.getByType(userId, 'unread-mail-number')
            .then(token => {
              if (token && result.value.length > token.value) {
                tokenService.update({userId: userId, type: 'unread-mail-number', value: result.value.length})
                cb(undefined, true)
              }
              else if (!token) {
                  tokenService.update({userId: userId, type: 'unread-mail-number', value: result.value.length})
                  cb(undefined, true)
              }
            })
            .catch(error => cb(error, undefined))
        }
      }
    })
}

/*function sync(userId, cb) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/beta')
  tokenService.getByType(userId, 'outlook')
    .then(outlookToken => {
      if (!outlookToken) {
        cb("syncError: No outlook token", undefined)
      }
      tokenService.getByType(userId, 'mail-deltatoken')
        .then(deltaToken => {
          if (!deltaToken) {
            console.log('first sync inc')
            firstSync(outlookToken, (firstDeltaValue) => {
              if (firstDeltaValue === 'no deltaLink') {
                cb("unknown error: firstsync: " + firstDeltaValue, undefined)
              }
              else {
                tokenService.update({userId: userId, type: 'mail-deltatoken', value: firstDeltaValue})
                  .then(updatedDeltaToken => {
                    otherSync(outlookToken, updatedDeltaToken, (newValue, value) => {
                      if (newValue === 'no deltaLink') {
                        cb("Unknown error: sync right after firstsync: " + newValue, undefined)
                      }
                      else {
                        tokenService.update({userId: userId, type: 'mail-deltatoken', value: newValue})
                        cb(undefined, values)
                      }
                    })
                  })
                  .catch(error => cb(error, undefined))
              }
            })
          }
          else {
            otherSync(outlookToken, deltaToken, (newValue, value) => {
              if (newValue === 'no deltaLink') {
                cb('Unknown error: othersync: ' + newValue, undefined)
              }
              else {
                tokenService.update({userId: userId, type: 'mail-deltatoken', value: newValue})
                cb(undefined, values)
              }
            })
          }
        })
        .catch(error => cb(error, undefined))
    })
    .catch(error => cb(error, undefined))
}

function firstSync(outlookToken, cb) {
    const syncMsgParams = {
      '$select': 'Subject',
      '$orderby': 'ReceivedDateTime desc'
    }
    const apiOptions = {
      token: outlookToken.value,
      folderId: 'Inbox',
      odataParams: syncMsgParams,
      pageSize: 30
    }
    outlook.mail.syncMessages(apiOptions, (error, messages) => {
      if (error) {
        console.error(error)
      }
      else {
        const deltaLink = messages["@odata.deltaLink"]
        if (deltaLink.includes('deltatoken')) {
          console.log('firstSync found a deltaToken...')
          cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1))
        }
        else {
          cb('no deltaLink')
        }
      }
    })
}

function otherSync(outlookToken, deltaToken, cb) {
  const syncMsgParams = {
    '$select': 'Subject',
    '$orderby': 'ReceivedDateTime desc'
  }
  const apiOptions = {
    token: outlookToken.value,
    deltaToken: deltaToken.value,
    folderId: 'Inbox',
    odataParams: syncMsgParams,
    pageSize: 30
  }
  outlook.mail.syncMessages(apiOptions, (error, messages) => {
    if (error) {
      console.error(error)
    }
    else {
      const values = messages['value']
      const deltaLink = messages["@odata.deltaLink"]
      const nextLink = messages["@odata.nextLink"]
      console.log(JSON.stringify(messages))
      if (deltaLink && (deltaLink.includes('deltatoken') || deltaLink.includes('deltaToken'))) {
        console.log('otherSync found a deltaToken')
        cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1), values)
      }
      else if (nextLink && (nextLink.includes('skipToken') || nextLink.includes('skiptoken'))) {
        console.log('otherSync found a skipToken')
        console.log('=>' + nextLink.substring(nextLink.lastIndexOf("=") + 1))
        skipSync(outlookToken, nextLink.substring(nextLink.lastIndexOf("=") + 1), cb)
      }
      else {
        cb('no deltaLink', values)
      }
    }
  })
}

function skipSync(outlookToken, skipTokenValue, cb) {
  const syncMsgParams = {
    '$select': 'Subject',
    '$orderby': 'ReceivedDateTime desc'
  }
  const apiOptions = {
    token: outlookToken.value,
    skipToken: skipTokenValue,
    folderId: 'Inbox',
    odataParams: syncMsgParams,
    pageSize: 30
  }
  outlook.mail.syncMessages(apiOptions, (error, messages) => {
    if (error) {
      console.error(error)
    }
    else {
      const values = messages['value']
      const deltaLink = messages["@odata.deltaLink"]
      const nextLink = messages["@odata.nextLink"]
      console.log(JSON.stringify(messages))
      if (deltaLink && (deltaLink.includes('deltatoken') || deltaLink.includes('deltaToken'))) {
        console.log('otherSync found a deltaToken')
        cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1), values)
      }
      else if (nextLink && (nextLink.includes('skipToken') || nextLink.includes('skiptoken'))) {
        console.log('otherSync found a skipToken')
        console.log(nextLink.substring(deltaLink.lastIndexOf("=") + 1))
        skipSync(outlookToken, nextLink.substring(deltaLink.lastIndexOf("=") + 1))
      }
      else {
        cb('no deltaLink', values)
      }
    }
  })
}*/
