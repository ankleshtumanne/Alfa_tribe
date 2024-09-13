const express=require("express")

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require("../modules/userModel.js");
const Authantication = require("../middleware/Authantication.js");

require('dotenv').config();
const router=express.Router()

router.post("/api/auth/register",async(req,res)=>{
    // console.log("ragister")
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
})

router.post("/api/auth/login",async(req,res)=>{
   const {email,password}=req.body
   try {
        const user=await User.findOne({email})
        console.log("users of ",user._id) // it will give us undefined
        // console.log(password) 
        // console.log(user.password) 
        if(!user) return res.json({message:"user Not Found"})

        if(user){
            bcrypt.compare(password,user.password, function(err,result){
                // console.log(result)  // am getting false
                if (err) {
                    return res.status(500).json({user: { id: user._id, username: user.username, email: user.email }});
                }
                if(result){
                    const token=jwt.sign({_id:user._id},process.env.Secret_key)
                    res.json({ success: true,message:"User LogIn successfully",token:token})
                } else{
                    return res.json({message:"invalid email/password"})
                }
                
            
            })
        }
       
    } catch (error) {
    res.json({message:"something went wrong ",error})
   }
})

router.get('/api/user/profile/:userId',Authantication, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId, 'username bio profilePicture');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json({ id: user._id, username: user.username, bio: user.bio, profilePicture: user.profilePicture });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put('/api/user/profile', Authantication, async (req, res) => {
    const { username, bio, profilePicture } = req.body;
    const userId=req.user._id
    try {
      // console.log("user",req.user)
      const user = await User.findByIdAndUpdate(userId, { username, bio, profilePicture }, { new: true });
      console.log("user",user)
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json({ success: true, message: 'Profile updated' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports=router