import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


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
    fs.unlinkSync(localfilePath) //remove the locally saved temporary file as it has already uploaded file to cloundinary.
 
    return uploadedfile
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localfilePath) //remove the locally saved temporary file as upload failed.
        
    }
}

export {uploadResult}