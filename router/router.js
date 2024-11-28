const router = require("express").Router();
const getUser = require("../controller/userController");

// home page
router.get("/", (req, res)=>{
    res.send("WELCOME TO THE HOME PAGE 😊")
})

//get user route
router.get("/user", getUser.userDetails);

//Get a single user
router.get("/user/:id", getUser.singleUserDetils);

//LogIn a user with email and password
router.post("/login/", getUser.validateLogIn, getUser.singleUserDetils);

//create user new user
router.post("/user", getUser.validateNewUser, getUser.createNewUser);

// Update user
router.put("/user/:id", getUser.updateUser);

// Delete user
router.delete("/user/:id", getUser.deleteUser);

module.exports = router;