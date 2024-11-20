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

//create user new user
router.post("/user", getUser.createNewUser);

// Update user
router.put("/user/:id", getUser.updateUser);

// Delete user
router.delete("/user/:id", getUser.deleteUser);

module.exports = router;