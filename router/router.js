const router = require("express").Router();
const getUser = require("../controller/userController");
const passport = require("passport");

// home page
router.get("/", (req, res)=>{
    res.send("WELCOME TO THE HOME PAGE 😊")
})

//get user route
router.get("/user", getUser.userDetails);

//Get a single user
router.get("/login/user/:id", getUser.singleUserDetils);

//LogIn a user with email and password
router.post("/login/", getUser.validateLogIn, getUser.logInUser);

// get login via google Oauth
router.get("/login", (req, res) => {
    res.send("Authentication failed. Please try logging in again or use another method.");
});

//create user new user
router.post("/user", getUser.validateNewUser, getUser.createNewUser);

// Update user
router.put("/login/user/:id",  getUser.validateNewUser, getUser.updateUser);

// Delete user
router.delete("/user/:id", getUser.deleteUser);

// Google Authentication
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  
router.get(
    "/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            // Successful authentication
            const user = req.user; // `req.user` contains the authenticated user
            req.session.user = user; // Save user details to session for manual session handling

            res.redirect("/home"); // Redirect to home or wherever you want
        } catch (err) {
            console.error("Error logging in the user:", err);
            res.redirect("/login"); // Redirect to login if something goes wrong
        }
    }
);
  
// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).send("Error logging out");
      res.redirect("/");
    });
});
  
module.exports = router;