const mongodb = require("../data/databass");
const {ObjectId} = require("mongodb");

// Get all users
const userDetails = async (req, res)=>{
   try {

    const result = await mongodb.userDataBass();
    const user = await result.collection("contacts").find().toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(user);    

   } catch (error) {
        res.status(404).json({message: "Cannot fetch data ❌"})
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
        const newUser = req.body
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
        }

        const update = {$set: req.body};

        const result = await mongodb.userDataBass();
        const db = await result.collection("contacts").updateOne({_id: new ObjectId(String(req.params.id))}, update);
    
        if(!db){
            res.status(401).send("Update failed ❌...please Try again");
        }
        res.setHeader("Content-Type", "application/json");
        res.status(201).send("Your contact was Updated successfully ✔");
          
       } catch (error) {
            res.status(500).json({message: "Server Error...🌍"})
            console.log("somthing went wrong fetching data....😒")
       }
}

const deleteUser = async (req, res)=>{
    try {

        if(!ObjectId.isValid(req.params.id)){
            return res.status(401).send("No contact found!!! ❌")
        }

        const result = await mongodb.userDataBass();
        const db = await result.collection("contacts").deleteOne({_id: new ObjectId(String(req.params.id))});
    
        if(!db.deletedCount > 0){
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
    deleteUser
};