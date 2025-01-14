export const authRouter = (express, passport) => {
  const router = express.Router();
  // google
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/displayUserDetails",
      failureRedirect: "/",
    })
  );
  // github
  router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );
  router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/displayUserDetails");
    }
  );

  return router;
};
