var jwt = require('jsonwebtoken');
require('dotenv').config();

async function Authantication(req,res,next){
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Authorization header is missing" });
    }
    const token=req.headers.authorization.split(" ")[1]
    // console.log(token)
    if(!token){
        return res.json({message:"token not found"})
    }
    try {
        // console.log("before hi")
        jwt.verify(token,process.env.Secret_key,(err,decode)=>{
            // console.log("after hi Auth", req.body)
            if(err) return res.json({message:"arror occured",err})
            if(decode){
                req.user=decode // me yaha id likh skta hu
                // req.user=decode     // its mandatary use
                
                // req.user=decode.user
                // console.log("request body",req.user)
                next()
            }else{
                // console.log(err)
                res.json({message:"somthing went wrong",err})
            }
           
        })
    } catch (error) {
        res.json({message:"please login first"})
    }
}

module.exports=Authantication