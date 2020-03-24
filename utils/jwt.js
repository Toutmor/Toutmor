const expressJwt = require('express-jwt');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = process.env.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/services/gmail/push',
            '/services/outlook/calendar/callback/calendarCreate',
            '/services/outlook/calendar/callback/calendarDelete',
            '/services/outlook/calendar/callback/calendarUpdate',
            '/services/outlook/mail/callback/mailCreate',
            '/services/outlook/mail/callback/mailDelete',
            '/services/outlook/mail/callback/mailUpdate',
            '/services/outlook/contact/callback/contactCreate',
            '/services/outlook/contact/callback/contactDelete',
            '/services/outlook/contact/callback/contactUpdate',
            '/services/outlook/calendar/callback/me'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};
