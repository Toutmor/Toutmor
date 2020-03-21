const userService = require('../users/user.service')
const tokenService = require('../tokens/token.service')
const spotify = require('./spotify/spotify.service')
const areaService = require('../areas/area.service')

var actArray = {"play": spotify.play,
                "pause": spotify.pause,
                "next": spotify.skipnext};

function react_to(bool, who, user) {
    areaService.getByTrigger(user._id, who).then(array=>{
        if (array == null)
            return;
        array.forEach(Element =>{
            if (typeof(Element.prevState) === 'undefined')
                Element.prevState = false;
            if (bool && !Element.prevState) {
                actArray[Element.actionName](user._id);
                Element.prevState = true;
            } else if (!bool && Element.prevState)
                Element.prevState = false;
            else
                return;
            areaService.update(Element);
        });
    }).catch(error => console.error(error));
}
function checks_spotify(user){
    tokenService.getByType(user._id, 'spotify')
    .then(token => {
        if(!token)
            return;
        spotify.is_play(token.value, react_to, user);
        spotify.is_device(token.value, react_to, user);
        spotify.is_shuffle(token.value, react_to, user);
    }).catch(error => console.error(error));
}

function intervalFunc() {
    userService.getAll().then(user =>{
        user.forEach(Element => {
            checks_spotify(Element);
        });
    });
}

setInterval(intervalFunc, 1500);
