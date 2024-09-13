const express=require("express")

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require("../modules/userModel.js");
const Authantication = require("../middleware/Authantication.js");
require('dotenv').config();
const router=express.Router()

async function Ragistration() {
    const {username,email,password}=req.body
    try {
        console.log("ragister")
        bcrypt.hash(password,8,async function(err, hash) {

            const data=await User.findOne({email})
            if(data) return res.send("user already present")
            
            if(!err){
                const user=new User({email,username,password:hash})
                await user.save()
                console.log("user post ",user)
                res.json({ success: true, message: 'User registered successfully', userId: user._id })
            }
            else{
                res.json({success: false,message:"error occured during hashing of password",err})
            }
            
        });
            
    }catch (error) {
            res.json({message:"error occured",error})
        
    }
}

module.exports=Ragistration