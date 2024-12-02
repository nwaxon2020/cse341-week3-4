const passport = require("passport");

require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passportOauth = passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser((user, done)=>{
    done(null, profile);
    
})
passport.deserializeUser((user, done)=>{
    done(null, profile);
})

module.exports = {passportOauth};