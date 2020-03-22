const tokenService = require('../../tokens/token.service')
const { google } = require('googleapis');

module.exports = {
  subscribe
}
function subscribe(userId) {
    /*tokenService.getByType(userId, 'google').then(token=>{
      if (!token)
        return;*/
        authObj = new  google.auth.OAuth2();
        authObj.setCredentials({
            access_token: 'ya29.a0Adw1xeWSME5zwQFCgLXhMSkyrW9oYIjzPPsIjtKjBvVBl46v58F-e-ekz28MjbcPhjzergfwWavhkLUF-WwKKFhx3sdPqQHvMityhUZ-efasTP1nPAooyGG1sHNJM5EQGm2ot0ek1F_CZgksQLUafKAl2zJgl1Uvap8'
        });
        const gmail = google.gmail({
            version: 'v1',
            auth: authObj,
        });
        gmail.users.watch({
            userId: "lary.sacoche@gmail.com",
            resource: {
              topicName: "projects/area-270123/topics/gmail",
            }
          }, (err, result) => {
            console.log("Error:", err);
            console.log("Watch reply:", result);
          })
    //});
}