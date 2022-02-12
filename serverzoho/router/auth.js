const express = require('express');
const { encrypt, decrypt } = require('../passwordsecurity/crypto');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('../database/connection');
const User=require('../model/userSchema');
router.use((req, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
  });
//api for signup
router.post('/signup' ,async (req,res) => {
    const {email,password,secretcode}=req.body;
    const passwordeny = encrypt(password);
    const secretcodeeny = encrypt(secretcode);
    try{
        const response=await User.findOne({email:email});
        if(response===null){
            const jwtToken=jwt.sign({email:email},process.env.SECRET_KEY);
            const user = new User({email,password:passwordeny,secretcode:secretcodeeny,token:jwtToken});
            const resp=await user.save();
            if(resp){
                res.status(201).json({message:"User details registered successfully",
            jwtToken:jwtToken});
            }
            else{
                res.status(500).json({message:"Failed to register the User details"});
            }
        }
        else{
            const {token}=response
            return res.status(422).json({message:"User Already exists",jwtToken:token});
        }   
    }
    catch (err){
        console.log(err);  
    }
});


//api for signin
router.post('/',async (req,res)=>{
    const {email,password}=req.body;
    const passwordUser = password;
   try{
    const response=await User.findOne({email:email});
    if(response===null){
        return res.status(404).json({message:`User not registered. Please sign up`});
    }
    if(response!==null){
        const {password,token}=response;
        const passworddey = decrypt(password)
        if(passwordUser===passworddey){

            return res.status(201).json({message:"Successfully loged in",jwtToken:token});
        }
        else{
            return res.status(401).json({message:"Invalid Credentials"});
        }   
    }
   }
   catch (err){
       console.log(err);
   }
});

//api for forgetpassword
router.post('/forgetpassword',async (req,res)=>{
    const {email,secretcode}=req.body;
    const secretcodeUser = secretcode;
    try{
        const response=await User.findOne({email:email});
        if(response===null){
            return res.status(200).json({message:"Unregistered Email"});
        }
        if(response!==null){
            const {secretcode,password,token}=response
            const secretcodedey= decrypt(secretcode);
            if(secretcodedey===secretcodeUser){
                const passworddey= decrypt(password);
                return res.status(201).json({password:`password is :${passworddey}`,jwtToken:token});
            }
            else{
                return res.status(401).json({message:"Email or Secret code is incorrect"});
            }
        }
    }
    catch(err){
        console.log(err);
    }
})

//api for posting comment
router.post('/comment',async (req,response)=>{
    const {comment,token}=req.body;
    try{
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            const email=payload.email;
            const filter = { email:email};
            const update = {$push:{ comment: comment }};
            const res = await User.findOneAndUpdate(filter, update, {
                new: true
            });
            if(res){
               return response.status(201).json({message:"comment added successfully"});
            }
    } catch(err){
        console.log(err);
    }
})

///Api to get all comments
router.get('/allcomment',async (req,res)=>{
    try{
        const response=await User.find({});
        const {email,comment}=response
        const userDeatails=response.map((eachUser)=>{
         return({email:eachUser.email,
         comment:eachUser.comment}
         )
        })
            if(response){
               return res.status(201).json({users:userDeatails});
            }
            else{
                return res.status(404).json({message:"unable to fetch users"})
            }
    } catch(err){
        console.log(err);
    }
})


module.exports = router;