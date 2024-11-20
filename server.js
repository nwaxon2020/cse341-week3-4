const express = require("express");
const app = express();
require("dotenv").config();


app.get("/", (req,res)=>{
    res.send("Hello new project");
})

const port = process.env.PORT || 3000;
const host = process.env.HOST;

app.listen(port, ()=>{
    console.log(`App listening on ${host}:${port}`)
});