const {MongoClient} = require("mongodb");
require("dotenv").config();

let itsConnected;

const userDataBass = async ()=>{
    try {
        if (itsConnected){
            return itsConnected;
        }

        const dataResult = await new MongoClient(process.env.MONGO_URI).connect();


        itsConnected = dataResult.db();
        console.log("DataBass connected successfully ✔");
        return itsConnected;

    } catch (err) {
        console.error("Somthing went wrong with the connection ❌", err);
    }
}


module.exports = {userDataBass};