const tokenService = require('../../tokens/token.service')
const areaService = require('../../areas/area.service')
const { google } = require('googleapis');

module.exports = {
  subscribe
}
function subscribe(area) {
    tokenService.getByType(area.userId, 'google').then(token=>{
      if (!token)
        return;
        authObj = new  google.auth.OAuth2();
        authObj.setCredentials({
            access_token: 'ya29.a0Adw1xeWKeZEG0jTFlHbedz47vw3cgJHBaTPazfPYf3ay98rghfBPbNwSROdW5kBYdIAUdOgQW5yeXkl-0f4EIQndNhSoBBKLGCnD0hJvo4HdIDl31aigQbWSOLTT7z91U3xYj-zo7zbBnWjZfOnlWfp7xLPfmqwMyuo'
        });
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
