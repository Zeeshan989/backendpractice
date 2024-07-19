import mongoose, {Schema} from "mongoose";


const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MONGO DB CONNECTED !! DB HOST :${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR",error)
        process.exit(1)
    }
}

export default connectDB

