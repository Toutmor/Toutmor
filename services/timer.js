const userService = require('../users/user.service')
const tokenService = require('../tokens/token.service')
const spotify = require('./spotify/spotify.service')
const gmail = require('./gmail/gmail.service')
const areaService = require('../areas/area.service')
const outlookCalendar = require('./outlook/calendar/calendar.service')
const outlookMail = require('./outlook/mail/mail.service')
const outlookContact = require('./outlook/contact/contact.service')

module.exports = {react_to};

var actArray = {"play": spotify.play,
                "pause": spotify.pause,
                "next": spotify.skipnext,
                "sendOutlook": outlookMail.send,
                "createOutlook": outlookCalendar.create,
                "createContactOutlook": outlookContact.create
              };
var triggerArray = {"play": spotify.is_play,
                    "shuffle": spotify.is_shuffle,
                    "device": spotify.is_device,
                    "incgmail": gmail.subscribe,
                    "calendarCreate": outlookCalendar.subscribe,
                    "calendarDelete": outlookCalendar.subscribe,
                    "calendarUpdate": outlookCalendar.subscribe,
                    "mailCreate": outlookMail.subscribe,
                    "mailDelete": outlookMail.subscribe,
                    "mailUpdate": outlookMail.subscribe,
                    "contactCreate": outlookContact.subscribe,
                    "contactDelete": outlookContact.subscribe,
                    "contactUpdate": outlookContact.subscribe
                  };

function react_to(bool, area) {
    if ((bool && !area.prevState) || area.type > 0) {
        actArray[area.actionName](area);
        area.prevState = true;
    } else if (!bool && area.prevState)
        area.prevState = false;
    else
        return;
    areaService.update(area);
}

function checkTriggerTimers(area) {
  console.log('area token Target === ' + area.tokenTarget)
  tokenService.getByType(area.userId, area.tokenTarget)
    .then(token => {
      if (!token) {
        return
      }
      triggerArray[area.triggerName](token.value, react_to, area)
    })
    .catch(error => console.error(error))
}

function intervalFunc() {
  areaService.getAll()
    .then(area =>{
      area.forEach(Element => {
        if (Element.type) {
          if (Element.userId === '5e727ac2e696263f897645ec') {
            Element.type === 1 ? triggerArray[Element.triggerName](Element) : 0;
          }
        }
        else
        Element.userId == '5e727ac2e696263f897645ec' ? checkTriggerTimers(Element) : 0;
      });
    })
    .catch(error => console.error(error));
}

setInterval(intervalFunc, 1500);
