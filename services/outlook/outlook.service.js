const outlook = require('node-outlook')
const areaService = require('../../areas/area.service')

module.exports = {
  getAllUnread,
  send
}

function getAllUnread(outlookTokenValue, cb, area) {
  outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0')
  const queryParams = {
    '$select': 'Subject',
    '$orderby': 'ReceivedDateTime desc',
    '$filter': 'isRead eq false',
    '$top': 20
  }

  outlook.mail.getMessages({token: outlookTokenValue, odataParams: queryParams, folderId: 'Inbox'},
    function(error, result) {
      if (error) {
        console.error(error)
        return;
      }
      const nbUnread = result.value.length
      console.log('nbUnread: ' + nbUnread)
      if (nbUnread === 0) {
        cb(false, area)
      }
      else {
        if (area.triggerParams.length === 0 || area.triggerParams[0] < nbUnread) {
          areaService.update({userId: area.userId, triggerName: area.triggerName, triggerParams: [nbUnread]})
          cb(true, area)
        }
        else {
          console.log('=> ' + area.triggerParams.length)
          console.log('and => ' + area.triggerParams[0])
          cb(false, area)
        }
      }
    }
  )
}

function send(param) {
  console.log('sendOutlook: ' + param)
}
