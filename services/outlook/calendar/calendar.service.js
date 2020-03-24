const outlook = require('node-outlook')
const request = require('request-promise')
const moment = require('moment')
const tokenService = require('../../../tokens/token.service')
const areaService = require('../../../areas/area.service')

outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')

module.exports = {
  getAll,
  subscribe,
  create
}

function getAll(userId) {
  tokenService.getByType(userId, 'outlook')
  .then(token => {
    const queryParams = {
      '$select': 'Subject,Start,End',
      '$orderby': 'Start/DateTime desc',
      '$top': 20
    }

    outlook.calendar.getEvents({token: token.value, odataParams: queryParams},
      function(error, result) {
        if (error) {
          throw error
        }
        console.log('getEvents returned ' + result.value.length + ' events.');
        result.value.forEach(function(event) {
          console.log('  Subject:', event.Subject);
          console.log('  Start:', event.Start.DateTime.toString());
          console.log('  End:', event.End.DateTime.toString());
        });
      }
    )
  })
  .catch (error => console.error(error))
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
          "Resource": "https://outlook.office.com/api/v2.0/me/events",
          "NotificationURL": "https://obscure-springs-42273.herokuapp.com/services/outlook/calendar/callback/" + area.triggerName,
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
          console.log('err 1: ' + err + 'err 1 over')
          console.log(err.message)
          console.log(JSON.stringify(err))
        })
    })
    .catch((err) => {
      console.log('err 2: ' + err + 'err 2 over')
    })
}

function create(area) {
  console.log('create (calendar)')
  tokenService.getByType(area.userId, 'outlook')
    .then(token => {
      outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
      const newEvent = {
        Subject: area.actionParams[0],
        Body: {
          ContentType: 'Text',
          Content: 'This is an event created by trigger "' + area.triggerName + '"'
        },
        Start: {
          DateTime: area.actionParams[1],
          TimeZone: "Eastern Standard Time"
        },
        End: {
          DateTime: area.actionParams[2],
          TimeZone: "Eastern Standard Time"
        }
      }
      outlook.calendar.createEvent({token: token.value, event: newEvent}, function(error, result) {
        if (error) {
          console.error(error.message)
        } else {
          console.log(JSON.stringify(result))
        }
      })
    })
    .catch(error => console.error(error))
}
