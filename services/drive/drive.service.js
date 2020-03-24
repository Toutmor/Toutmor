const tokenService = require('../../tokens/token.service')
const { google } = require('googleapis');

module.exports = {empty}

function empty(area) {
    tokenService.getByType(area.userId, 'google').then(token=>{
        if (!token)
            return;
        authObj = new  google.auth.OAuth2();
        authObj.setCredentials({access_token: token.value});
        const drive = google.drive({ version: "v3", auth: authObj });
        drive.files.emptyTrash({
            userId: "me"
        }, (err, result) => {
            console.log("Error:", err);
            console.log("Watch reply:", result);
        });
    });
}