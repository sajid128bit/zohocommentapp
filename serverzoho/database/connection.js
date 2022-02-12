const mongoose = require('mongoose');
const dotenv = require('dotenv');
const DB=process.env.DATABASE
mongoose.connect(DB,{
    useNewUrlParser:true
}).then(()=>{
    console.log("connection established");
}).catch((err)=>console.log("connection failed"));
