// const passport = require('passport');
// const GitHubStrategy = require('passport-github2').Strategy;

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((obj, done) => {
//   done(null, obj);
// });

// passport.use(new GitHubStrategy({
//   clientID: process.env.GITHUB_CLIENT_ID,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET,
//   callbackURL: process.env.CALLBACK_URL
// },
// (accessToken, refreshToken, profile, done) => {
//   console.log('GitHub profile:', profile); // Add this line
//   return done(null, profile);
// }
// ));

// module.exports = passport;
