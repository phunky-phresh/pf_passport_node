const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');


const keys = require('./keys.env');

passport.use( 
  new GoogleStrategy({
  // options for strategy
    callbackURL: '/auth/google/redirect',
    clientID: '178954412705-2cao5qsgnvahd3otpeqd0h2fdqq9hs1g.apps.googleusercontent.com',
    clientSecret: 'OsJNj1hNh5UOEZ-PdczV96vL'
  }, () => {
    // passport callback function
    })
);

