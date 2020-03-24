const request = require('request-promise')
const outlook = require('node-outlook')
const tokenService = require('../../../tokens/token.service')
const areaService = require('../../../areas/area.service')

module.exports = {
  send,
  subscribe
  //sync
}

function send(params) {
  console.log('outlook send: ' + params)
  tokenService.getByType(params.userId, 'outlook')
    .then(token => {
      if (!token) {
        return
      }
      outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
      if (params.actionParams.length < 2) {
        console.error('actionParams length: ' + params.actionParams.length)
        return
      }
      const newMsg = {
        Subject: 'This is an email sent by trigger "' + area.triggerName + '"',
        Body: {
          ContentType: 'Text',
          Content: params.actionParams[0]
        },
        ToRecipients: [
          {
            EmailAddress: {
              Address: params.actionparams[1]
            }
          }
        ]
      }
      outlook.mail.sendNewMessage({token: token.value, message: newMsg}, (error, result) => {
        if (error) {
          console.error(error.message)
        } else {
          console.log(result)
        }
      })
    })
    .catch(error => console.error(error))
}

function subscribe(area) {
  tokenService.getByType(area.userId, 'outlook')
    .then(token => {
      if (!token) {
        throw "No outlook token found"
      }
      var changeType
      if (area.triggerName.includes("Create"))
        changeType = "Created"
      else if (area.triggerName.includes("Delete"))
        changeType = "Deleted"
      else if (area.triggerName.includes("Update"))
        changeType = "Updated"
      console.log('==> changeType: ' + changeType)
      console.log('token value: ' + token.value)
      const rqOptions = {
        uri: 'https://outlook.office.com/api/v2.0/me/subscriptions',
        method: 'POST',
        headers: {
          Authorization : 'Bearer ' + token.value
        },
        body : {
          "@odata.type":"#Microsoft.OutlookServices.PushSubscription",
          "Resource": "https://outlook.office.com/api/v2.0/me/mailfolders('Inbox')/messages",
          "NotificationURL": "https://obscure-springs-42273.herokuapp.com/services/outlook/mail/callback/" + area.triggerName,
          "ChangeType": changeType
        },
        json: true
      }
      request(rqOptions)
        .then((parsedBody) => {
          console.log('parsedBody:' + parsedBody + '\nparsedBody over')
          console.log(JSON.stringify(parsedBody))
          console.log(parsedBody.Id)
          area.triggerParams.push(parsedBody.Id)
          area.type = 2
          areaService.update(area)
        })
        .catch((err) => {
          console.log(err.message)
        })
    })
    .catch((err) => {
      console.log(err.message)
    })
}


/*function getAll(token, cb) {
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
}*/
