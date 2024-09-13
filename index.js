require('dotenv').config();
const mongoose=require("mongoose")
const express=require("express")
const connectToDB = require("./config/db");
const router = require('./routes/userRoutes');


const bodyParser = require('body-parser');
const postRouter = require('./routes/postRoutes');
const likeRouter = require('./routes/LikeRoutes');
const CommentRouter = require('./routes/CommentRouter');

const app=express()
const port = process.env.PORT

app.use(bodyParser.json());
app.use(express.json())

app.use("/user",router)
app.use(postRouter)
app.use(CommentRouter)
app.use(likeRouter)
app.listen(port,async(req,res)=>{
    await connectToDB()
    console.log("server started and connect to db")
})