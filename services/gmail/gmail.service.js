const tokenService = require('../../tokens/token.service')
const areaService = require('../../areas/area.service')
const { google } = require('googleapis');

module.exports = {
  subscribe,
  unsubscribe
}
function subscribe(area) {
    tokenService.getByType(area.userId, 'google').then(token=>{
      if (!token)
        return;
        authObj = new  google.auth.OAuth2();
        authObj.setCredentials({access_token: token.value});
        const gmail = google.gmail({
            version: 'v1',
            auth: authObj,
        });
        gmail.users.getProfile({
          auth: authObj,
          userId: 'me'
          }, function(err, res) {
          if (err) {
              console.log(err);
          } else {
              area.type = 2;
              area.triggerParams.push(res.data.emailAddress);
              areaService.update(area);
          }
      });
        gmail.users.watch({
            userId: "me",
            resource: {
              topicName: "projects/area-270123/topics/gmail",
            }
          }, (err, result) => {
            console.log("Error:", err);
            console.log("Watch reply:", result);
          })
    }).catch(error => console.error(error));
}

function unsubscribe(area) {
  tokenService.getByType(area.userId, 'google').then(token=>{
    if (!token)
        return;
      authObj = new  google.auth.OAuth2();
      authObj.setCredentials({access_token: token.value});
      const gmail = google.gmail({
        version: 'v1',
        auth: authObj,
      });
      gmail.users.stop({userId: "me"}, (err, result) => {
        console.log("Error:", err);
        console.log("Watch reply:", result);
      });
  }).catch(error => console.error(error));
}