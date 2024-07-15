const cookieParser = require('cookie-parser');
const cors = require('cors');

express=require('express')
const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
module.exports=app;