const userService = require('../users/user.service')
const tokenService = require('../tokens/token.service')
const spotify = require('./spotify/spotify.service')

function react_to_spot(bool, who, user) {
    if (bool)
        console.log(user.username+ ": "+ who + ': oui');
    else
        console.log(user.username+ ": "+ who + ': non');
}
function checks_spotify(user){
    tokenService.getByType(user._id, 'spotify')
    .then(token => {
        if(!token)
            return;
        spotify.is_play(token.value, react_to_spot, user);
        spotify.is_device(token.value, react_to_spot, user);
        spotify.is_shuffle(token.value, react_to_spot, user);
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