const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./router/router");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const mongoStore = require("connect-mongo")

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))// for HTML use only
app.use(bodyParser.json());

//Session middle ware
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        maxAge: 30000,
        secure: process.env.NODE_ENV === 'production' ? true : false
    },
    store: mongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 20*60
    })
}));

//Router middle ware
app.use("/", router);

const port = process.env.PORT || 3000;
const host = process.env.HOST;

app.listen(port, ()=>{
    console.log(`App listening on ${host}:${port}`)
});

// just to indicate database is connected
const database = require("./data/databass");
database.userDataBass();