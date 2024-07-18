const { v2: cloudinary } = require('cloudinary');
const fs=require('fs')


// Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloud_name, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, // Click 'View Credentials' below to copy your API secret
});



// Upload an image
const uploadResult = async(localfilePath)=>{
    try {
        if(!localfilePath) return null
        
const uploadedfile=await cloudinary.uploader
.upload(
    localfilePath, {
        resource_type:"auto"
    })
    console.log("File is uploaded on cloudinary",uploadResult)   
    return uploadedfile
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localfilePath) //remove the locally saved temporary file as upload failed.
        
    }
}

module.export=uploadResult