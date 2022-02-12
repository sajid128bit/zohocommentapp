const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:Object,
        required:true
    },
    secretcode:{
        type:Object,
        required:true
    },
    comment:{
        type:[String]
    },
    token:{
        type:String
    }
})

const User = mongoose.model('USER',userSchema);
module.exports = User;