const router = require("express").Router();
const getUser = require("../controller/userController");

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

//create user new user
router.post("/user", getUser.validateNewUser, getUser.createNewUser);

// Update user
router.put("/login/user/:id",  getUser.validateNewUser, getUser.updateUser);

// Delete user
router.delete("/user/:id", getUser.deleteUser);

module.exports = router;