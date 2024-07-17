
dotenv=require('dotenv').config()
express=require('express')
const app=express()


connectDB=require('./db/index.js')


connectDB().then(()=>{app.listen(process.env.PORT || 8000,()=>{console.log(`Server is running at port:${process.env.PORT}`)})}).catch((err)=>{
    console.log("MONGODB Connection failed !!!",err);
})