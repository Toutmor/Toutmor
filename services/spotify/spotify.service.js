const tokenService = require('../../tokens/token.service')
const request = require('request')

module.exports = {
  getUser,
  pause,
  skipnext,
  is_device,
  is_shuffle,
  is_play,
  play
}
function getUser(userId) {
  tokenService.getByType(userId, 'spotify')
    .then(token => {
      console.log('token value: ' + token.value)
    })
    .catch(error => console.error(error))
}
function play(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': 'Bearer ' + token.value,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        json: {}
      };
      request.put(options, function(error, response, body) {
        console.log(response.body);
      });
    }).catch(error => console.error(error))
}
function pause(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
          'Authorization': 'Bearer ' + token.value,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        json: {}
      };
      request.put(options, function(error, response, body) {
        console.log(response.body);
      });
    }).catch(error => console.error(error))
}
function skipnext(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/next',
        headers: {
          'Authorization': 'Bearer ' + token.value,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        json: {}
      };
      request.post(options, function(error, response, body) {
        console.log(response.body);
      });
    }).catch(error => console.error(error))
}

function is_play(token, callback, user) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };
    request.get(options, function(error, response, body) {
      if (error || !response.body)
        return;
      var res = JSON.parse(response.body);
      callback(res.is_playing, user);
    });
}

function is_shuffle(token, callback, user) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };
    request.get(options, function(error, response, body) {
      if (error|| !response.body)
        return;
      var shuffle= JSON.parse(response.body).shuffle_state;
      callback(shuffle, user);
    });
}
function is_device(token, callback, user) {
    var options = {
      url: 'https://api.spotify.com/v1/me/player/devices',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };
    request.get(options, function(error, response, body) {
      if (error|| !response.body)
        return;
        var device= JSON.parse(response.body)
      if (device.hasOwnProperty('devices') && device.devices.length > 0)
          callback(true, user);
      else
          callback(false, user);
    });
}