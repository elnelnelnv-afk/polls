require('dotenv').config();
const express = require('express');
const pollsRouter = require('./routers/polls');
require('./mongoose/db/mongoose');

const app = express();

app.use(express.json());
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers", "*");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT");
        return res.status(200).json({})
    }
    next()
})

app.use(pollsRouter)


module.exports = app;