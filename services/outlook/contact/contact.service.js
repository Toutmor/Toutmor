const request = require('request-promise')
const tokenService = require('../../../tokens/token.service')
const areaService = require('../../../areas/area.service')

module.exports = {
  create,
  subscribe
}

function create(area) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
  console.log('create (contact)')
  console.log('IIIIIICCCCCCIIIIIIIIII')
  tokenService.getByType(area.userId, 'outlook')
  .then(token => {
    if (!token) {
      console.log('no token')
      return;
    }
    const newContact = {
      GivenName: 'Contact added by trigger "' + area.triggerName + '"',
      Surname: area.actionParams[0],
      EmailAddresses: [{
        Address: area.actionParams[1],
        Name: area.actionParams[2]
      }]
    }
    outlook.contacts.createContact({token: token.value, contact: newContact}, function(error, result) {
      if (error) {
        console.error(error)
      } else {
        console.log('all good')
        console.log(JSON.stringify(result))
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
            "Resource": "https://outlook.office.com/api/v2.0/me/contacts",
            "NotificationURL": "https://obscure-springs-42273.herokuapp.com/services/outlook/contact/callback/" + area.triggerName,
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
