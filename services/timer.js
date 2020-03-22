const userService = require('../users/user.service')
const tokenService = require('../tokens/token.service')
const spotify = require('./spotify/spotify.service')
const gmail = require('./gmail/gmail.service')
const areaService = require('../areas/area.service')
const outlook = require('./outlook/outlook.service')

module.exports = {react_to};

var actArray = {"play": spotify.play,
                "pause": spotify.pause,
                "next": spotify.skipnext,
                "sendOutlook": outlook.send};
var triggerArray = {"play": spotify.is_play,
                    "shuffle": spotify.is_shuffle,
                    "device": spotify.is_device,
                    "incgmail": gmail.subscribe,
                    "unreadOutlook": outlook.getAllUnread};
function check_spotify(Element) {
    tokenService.getByType(Element.userId, 'spotify').then(token => {
        if (token)
        console.log(Element.triggerName);
            triggerArray[Element.triggerName](token.value, react_to, Element);
    }).catch(error => console.error(error));
}

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
  if (area.userId !== '5e727ac2e696263f897645ec') {
    console.log('skipped')
    return;
  }
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
    areaService.getAll().then(area =>{
        area.forEach(Element => {
            if (Element.type)
                Element.type === 1 ? triggerArray[Element.triggerName](Element.userId) : 0;
            else
            Element.userId == '5e724ff9144be648824d8d1f' ? checkTriggerTimers(Element) : 0;
        });
    }).catch(error => console.error(error);
}
//setInterval(intervalFunc, 1500);
