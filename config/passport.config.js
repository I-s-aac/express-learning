import * as GoStrategy from "passport-google-oauth2";
import * as GiStrategy from "passport-github2";

const GoogleStrategy = GoStrategy.Strategy;
const GitHubStrategy = GiStrategy.Strategy;

export const configure = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:3000/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, profile);
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        done(null, profile);
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   console.log("test 2");
        //   return done(err, user);
        // });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
};
