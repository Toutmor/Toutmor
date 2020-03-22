const outlook = require('node-outlook')
const request = require('request-promise')


const moment = require('moment')
const tokenService = require('../../../tokens/token.service')

outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')

module.exports = {
  getAll,
  sync,
  subscribe
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

function sync(userId, cb) {
  tokenService.getByType(userId, 'outlook')
    .then(outlookToken => {
      if (!outlookToken) {
        throw "No outlook token"
      }
      console.log('here')
      tokenService.getByType(userId, 'calendar-deltatoken')
        .then(deltaToken => {
          if (!deltaToken) {
            console.log('and here')
            firstSync(outlookToken, function(ret) {
              if (ret === 'no deltaLink') {
                throw "Unknown error: firstsync: " + ret
              }
              console.log('ret is ' + ret)
              tokenService.update({userId: userId, type: 'calendar-deltatoken', value: ret})
                .then(updatedDeltaToken => {
                  otherSync(outlookToken, updatedDeltaToken, function(newValue, values) {
                    console.log('new ret is: ' + newValue)
                    tokenService.update({userId: userId, type: 'calendar-deltatoken', value: newValue})
                    cb(values)
                  })
                })
                .catch(error => console.error(error))
            })
          }
          else {
            otherSync(outlookToken, deltaToken, function(newValue, values) {
              console.log('newValue is: ' + newValue)
              tokenService.update({userId: userId, type: 'calendar-deltatoken', value: newValue})
              cb(values)
            })
          }
        })
        .catch(error => console.error('error 1:' + error))
    })
    .catch(error => console.error('error 2:' + error))
}

function firstSync(outlookToken, cb) {
  console.log('???')
  const startDateTime = moment().format('YYYY-MM-DD')
  const endDateTime = moment().add(7, 'd').format('YYYY-MM-DD')
  const apiOptions = {
    token: outlookToken.value,
    startDateTime: startDateTime,
    endDateTime: endDateTime
  }

  outlook.calendar.syncEvents(apiOptions, function(error, events) {
    if (error) {
      console.log('this throw')
      throw error
    }
    console.log('other test: ' + JSON.stringify(events))
    const deltaLink = events["@odata.deltaLink"]
    console.log('deltaLink: ' + deltaLink)
    if (deltaLink.includes('deltatoken')) {
      console.log('next step')
      cb(deltaLink.substring(deltaLink.lastIndexOf("=") + 1))
    }
    else {
      cb('no deltalink')
    }
  })
}

function otherSync(outlookToken, deltaToken, cb) {
  const startDateTime = moment().format('YYYY-MM-DD')
  const endDateTime = moment().add(7, 'd').format('YYYY-MM-DD')
  const apiOptions = {
    token: outlookToken.value,
    deltaToken: deltaToken.value,
    startDateTime: startDateTime,
    endDateTime: endDateTime
  }
  outlook.calendar.syncEvents(apiOptions, function(error, events) {
    if (error) {
      console.log('this throw')
      throw error
    }
    console.log('other sync other test: ' + JSON.stringify(events))
    const deltaLink = events["@odata.deltaLink"]
    console.log('deltaLink: ' + deltaLink)
    const values = events['value']
    if (deltaLink.includes('deltatoken') || deltaLink.includes('deltaToken')) {
      console.log('next step')
      const newValue = deltaLink.substring(deltaLink.lastIndexOf("=") + 1)
      cb(newValue, values)
    }
    else {
      console.log('no deltalink')
      cb('no deltalink', values)
    }
  })
}

function subscribe(userId) {
  tokenService.getByType(userId, 'outlook')
    .then(token => {
      if (!token) {
        throw "No outlook token found"
      }
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
          "NotificationURL": "https://obscure-springs-42273.herokuapp.com/services/outlook/calendar/callback/me",
          "ChangeType": "Created"
        },
        json: true
      }
      request(rqOptions)
        .then((parsedBody) => {
          console.log('parsedBody:' + parsedBody + '\nparsedBody over')
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
