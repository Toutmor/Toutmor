const userService = require('../users/user.service')
const tokenService = require('../tokens/token.service')
const spotify = require('./spotify/spotify.service')
const gmail = require('./gmail/gmail.service')
const drive = require('./drive/drive.service')
const areaService = require('../areas/area.service')
const outlook = require('./outlook/outlook.service')
const discord = require('./discord/discord.service')

module.exports = {react_to};

var actArray = {"play": spotify.play,
                "pause": spotify.pause,
                "next": spotify.skipnext,
                "prev": spotify.skipprev,
                "shuffle": spotify.shuffle,
                "repeat": spotify.repeat,
                "seek": spotify.seek,
                "volumezero": spotify.volume_zero,
                "volumecent": spotify.volume_cent,
                "empty": drive.empty,
                "discordsend": discord.send_message,
                "sendOutlook": outlook.send};
var triggerArray = {"play": spotify.is_play,
                    "shuffle": spotify.is_shuffle,
                    "repeat": spotify.is_repeat,
                    "device": spotify.is_device,
                    "follower": spotify.is_follower,
                    "picture": spotify.is_picture,
                    "pause": spotify.is_pause,
                    "change": spotify.is_change,
                    "incgmail": gmail.subscribe,
                    "unreadOutlook": outlook.getAllUnread};
function react_to(bool, area) {
    if ((bool && !area.prevState) || area.type > 0) {
        console.log('je fait une action');
        actArray[area.actionName](area);
        area.prevState = true;
    } else if (!bool && area.prevState)
        area.prevState = false;
    else
        return;
    console.log(areaService.update(area));
}
function checkTriggerTimers(area) {
    console.log(area);
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
                Element.type === 1 ? triggerArray[Element.triggerName](Element) : 0;
            else
                checkTriggerTimers(Element); //Element.userId == '5e724ff9144be648824d8d1f' ?  : 0;
        });
    }).catch(error => console.error(error));
}
setInterval(intervalFunc, 1500);