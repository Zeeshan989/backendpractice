const cookieParser = require('cookie-parser');
const cors = require('cors');
express=require('express')
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true, 
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import

const userroute=require('./routes/user.routes.js')

// routes declaration
app.use("/api/v1/users",userroute)
module.exports=app; 