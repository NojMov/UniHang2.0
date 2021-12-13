const passport = require("passport");
const dotenv = require("dotenv");

// Load config.env
dotenv.config({ path: "./config.env" });

const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      // Connection Confguration to Google authentication
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
    },
    // What to do once the user is successfully authenticated
    function (request, accessToken, refreshToken, profile, done) {
            return done(null, profile); // if you have a db the null will be an err
    })
);

// Serialize and Deserialize Users -- Setting up for user sessions/cookies
passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});