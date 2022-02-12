const  express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const  app = express();
dotenv.config({path:'./config.env'});
const PORT = process.env.PORT || 5000;
require('./database/connection')
app.use(express.json())
app.use(require('./router/auth'));
app.listen(PORT,()=>{
    console.log(`server started at PORT ${PORT}`);
})
