const mongodb = require("../data/databass");
const {ObjectId} = require("mongodb");
const {check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");

// Account creation validation rules
const validateNewUser = [
    check("userName")
    .notEmpty()
    .isLength({min: 3})
    .withMessage("uerName feild can not be emptyor less than 3 characters")
    .isString()
    .withMessage("Only letters alowed"),

    check("email")
    .isEmail()
    .withMessage("please enter a valid email address")
    .notEmpty()
    .withMessage("Email field cannot be empty")
    .bail()
    .custom(async (email)=>{
        const db = await mongodb.userDataBass();
        const user = await db.collection("contacts").findOne({email: email});
        if(user){
            throw new Error("User already Exist....Please use a diffrent email address or logIn");
            
        }
    }),

    check("occupation")
    .notEmpty()
    .withMessage("Occupation field cannot be empty"),

    check("password")
    .notEmpty()
    .isLength({min: 3})
    .withMessage("Password must be above 3 charcters")
    .matches(/^(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
    .withMessage("Password must contain special charcters & numbers"),

    
]

// login validation rules
const validateLogIn = [
    check("email").isEmail().notEmpty().withMessage("Invalid email address")
    .bail()
    .custom(async(email)=>{
        const db = await mongodb.userDataBass();
        const user = await db.collection("contacts").findOne({email: email})

        if(!user){
            throw new Error("User not found....please enter a valid email or register an account");
        }
    }),

    check("password").notEmpty()
    .isLength({min: 3})
    .withMessage("Incorrect password")
    .matches(/^(?=.*\d)(?=.*[@#$%^&+=!]).*$/)
    .withMessage("Incorrect password Password must contain special charcters"),

]

// Get all users
const userDetails = async (req, res)=>{
   try {

    const result = await mongodb.userDataBass();
    const user = await result.collection("contacts").find().toArray();

    if(user.length === 0){
        return res.send("No Item found")
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(user);    

   } catch (error) {
        res.status(500).json({message: "Server Error🌍!!! Cannot fetch data ❌"})
        console.log("somthing went wrong fetching data....😒")
   }
}

// Get a single users
const singleUserDetils = async (req, res)=>{
    
    try {
        if(!ObjectId.isValid(req.params.id)){
            return res.status(401).send("Contact not found!!!❌")
        }

        const result = await mongodb.userDataBass();
        const user = await result.collection("contacts").findOne({_id: new ObjectId(String(req.params.id))});

        if(!user){
            return res.status(401).send({error: "User not found!!!!"});
        }

        if(!req.session.user || req.session.user._id.toString() !== user._id.toString()){
            return res.status(401).send({msg: "Session Time-Out...Please log in"});
        }

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(user);    
    
       } catch (error) {
            res.status(500).json({message: "Server Error🌍"})
            console.log("somthing went wrong fetching data....😒")
       }
}

// LogIn a single users
const logInUser = async (req, res)=>{
    
    try {
        const err = validationResult(req);
        if(!err.isEmpty()){
            const allError = err.array().map((errs)=> errs.msg);
            return res.status(401).send({error: allError});
        }

        const {email, password} = req.body;

        const result = await mongodb.userDataBass();
        const user = await result.collection("contacts").findOne({email: email});
     
        if(!user){
            return res.status(401).send({error: "Invalid email"});
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if(!checkPassword){
            return res.status(401).send({error: "Invalid password"});
        }

        // setting the session
        req.session.user = user;

        res.setHeader("Content-Type", "application/json");
        res.status(200).json(user);    
    
       } catch (error) {
            res.status(500).json({message: "Server Error🌍"})
            console.log("somthing went wrong fetching data....😒")
       }
}

// Create a new user
const createNewUser = async (req, res)=>{
    try {

        const err = validationResult(req);
        if(!err.isEmpty()){
            const allError = err.array().map((errs) => errs.msg);
            return res.status(401).send({error: allError});
        };

        const {
            userName,
            email, 
            occupation, 
            password 
        } = req.body;

        const hashPassword = await bcrypt.hash(password, 13);

        const newUser = {
          ...req.body, 
            password: hashPassword
        };

        const result = await mongodb.userDataBass();
        const db = await result.collection("contacts").insertOne(newUser);
    
        if(!db){
            res.status(401).send("Your contact was not added...please Try again");
        }
        res.setHeader("Content-Type", "application/json");
        res.status(201).send("Your contact was added successfully ✔");
          
       } catch (error) {
            res.status(404).json({message: "Cannot fetch data ❌"})
            console.log("somthing went wrong fetching data....😒")
       }
}

// Update a new user
const updateUser = async (req, res)=>{
    try {
         
        if(!ObjectId.isValid(req.params.id)){
            return res.status(401).send("No contact found!!! ❌")
        };

        const result = await mongodb.userDataBass();

        const user = await result.collection("contacts").findOne({_id: new ObjectId(String(req.params.id))});        

        if(!user){
            return res.status(401).send("User not found");
        }

        if(!req.session.user || req.session.user._id.toString() !== user._id.toString()){
            return res.status(401).send({msg: "Sorry we could not get this contact...Log in to continue"});
        }

        let update = {$set: {...req.body}};

        if(req.body.password){
            const hashNewPassword = await bcrypt.hash(req.body.password, 13);
            update.$set.password = hashNewPassword
        };

        const db = await result.collection("contacts").updateOne({_id: new ObjectId(String(req.params.id))}, update);
    
        if(!db){
            res.status(401).send("Update failed ❌...please Try again");
        };
        res.setHeader("Content-Type", "application/json");
        res.status(200).send("Your contact was Updated successfully ✔");
          
       } catch (error) {
            res.status(500).json({message: "Server Error...🌍"})
            console.log("somthing went wrong fetching data....😒")
       };
}

const deleteUser = async (req, res)=>{
    try {

        if(!req.session.user){
            return res.status(401).send({msg: "Please log in to continue..."})
        }

        if(!ObjectId.isValid(req.params.id)){
            return res.status(401).send("No contact found!!! ❌")
        }

        const result = await mongodb.userDataBass();
        const db = await result.collection("contacts").deleteOne({_id: new ObjectId(String(req.params.id))});
    
        if(!db.deletedCount > 0 || !db){
            res.status(401).send("Delete failed ❌...please Try again");
        }
        res.setHeader("Content-Type", "application/json");
        res.status(201).send("Your contact was deleted successfully ✔");
          
       } catch (error) {
            res.status(500).json({message: "Server Error...🌍"})
            console.log("somthing went wrong fetching data....😒")
       }
}



module.exports = {
    userDetails, 
    createNewUser,
    singleUserDetils,
    updateUser,
    deleteUser,
    logInUser,
    validateNewUser,
    validateLogIn
};