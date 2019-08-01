const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys.js");
const redirectURL = "/user/login/google/redirect";
const connection = require("./db.js");

passport.serializeUser((user, done) => {
    return done(null, user.email);
});

passport.deserializeUser((email, done) => {
    connection.query(`CALL getUserByEmail('${email}')`, (err, row) => {
        return done(null, row);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            callbackURL: redirectURL
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            connection.query(`CALL getUserByGoogleID('${profile.id}')`, (err, row) => {
                console.log(row)
                if (row[0][0]) {
                    return done(null, row[0][0]);
                } else {
                    connection.query(`CALL createUserThruGoogle('${profile.displayName}', '${profile.emails[0].value}', '${profile.id}')`)
                    return done(null, profile);
                }
            })
        }
    )
);
