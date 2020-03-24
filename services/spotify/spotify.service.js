const tokenService = require('../../tokens/token.service')
const request = require('request')

module.exports = {
  getUser,
  pause,
  shuffle,
  play,
  seek,
  skipnext,
  skipprev,
  repeat,
  volume_cent,
  volume_zero,
  is_device,
  is_shuffle,
  is_repeat,
  is_follower,
  is_picture,
  is_pause,
  is_change,
  is_play,
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

function skipprev(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/previous',
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

function shuffle(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/shuffle?state=true',
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

function seek(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/seek?position_ms=30000',
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

function volume_zero(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/volume?volume_percent=0',
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

function volume_cent(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/volume?volume_percent=100',
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

function repeat(area) {
  tokenService.getByType(area.userId, 'spotify')
    .then(token => {
      var options = {
        url: 'https://api.spotify.com/v1/me/player/repeat?state=track',
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


function is_pause(token, callback, user) {
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
    callback(!res.is_playing, user);
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
      if (error|| !response.body) {
        console.log(token)
        return;
      }
      var shuffle= JSON.parse(response.body).shuffle_state;
      callback(shuffle, user);
    });
}
function is_follower(token, callback, user) {
  var options = {
    url: 'https://api.spotify.com/v1/me/',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };
  var bool = false;
  request.get(options, function(error, response, body) {
    if (error|| !response.body)
      return;
    var followers = JSON.parse(response.body).followers.total;
    if (user.triggerParams && user.triggerParams[0] !== followers)
      bool = true;
    console.log(followers);
    user.triggerParams = [];
    user.triggerParams.push(followers);
    callback(bool, user);
  });
}

function is_picture(token, callback, user) {
  var options = {
    url: 'https://api.spotify.com/v1/me/',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };
  var bool = false;
  console.log('oui')
  request.get(options, function(error, response, body) {
    if (error|| !response.body) {
      return;
    }
    var picture = JSON.parse(response.body).images[0].url;
    if (user.triggerParams[0] && user.triggerParams[0] !== picture)
      bool = true;
    user.triggerParams= [];
    user.triggerParams.push(picture);
    callback(bool, user);
  });
}

function is_change(token, callback, user) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };
  var bool = false;
  request.get(options, function(error, response, body) {
    if (error || !response.body)
      return;
    var id = JSON.parse(response.body).item;
    if (!id)
      return;
    if (user.triggerParams[0] && user.triggerParams[0] !== id.id)
      bool = true;
    user.triggerParams =[];
    user.triggerParams.push(id.id);
    callback(bool, user);
  });
}



function is_repeat(token, callback, user) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };
  var bool = false;
  request.get(options, function(error, response, body) {
    if (error|| !response.body)
      return;
    var shuffle= JSON.parse(response.body).repeat_state;
    if (shuffle !== 'off')
      bool = true;
    callback(bool, user);
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