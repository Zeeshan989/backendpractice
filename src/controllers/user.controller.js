const ApiError = require('../utils/ApiError.js');
const asyncHandler=require('../utils/asyncHandler.js')
const User=require('../models/users.model.js')
const uploadResult=require('../utils/cloudinary.js')


const registerUser = asyncHandler(async (req, res) => {
    // Registration logic here
    //1.take username,fullname,password and other entities
    //2.validate fields are not empty,email is it in correct format
    //3.check if user already exists (username or email)
    //4.check for images , check for avatar
    //5.Upload file to cloudinary
    //6.get string file url from cloudinary(make sure you get avatar image url for cloudinary)
    //7.make user object and create entity
    //8.remove password and refresh token from response
    //9.check for user creation
    //10.return response
    const{username,fullName,email,password}=req.body
    console.log("email:",email);
    //No field is left empty check
    if(!username || !fullName || !email || !password){
        throw new ApiError(400,'All fields are required')
    }
    //check if user already exists
   existeduser= User.findOne(
        {
            $or:[{username},{email}]
        }
    )
    if(existeduser){throw new ApiError(409,'User already exists')}
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverLocalPath=req.files?.avatar[0]?.path;



    if(!avatarLocalPath){throw new ApiError(400,'Avatar is required')}
    res.status(200).json({
        message:'REGISTERING',
    })

    const avatar=await uploadResult(avatarLocalPath)
    const cover=await uploadResult(coverLocalPath)

    if(!avatar){
        throw new ApiError(400,'Avatar is required')
    }

    const user=await User.create({
        fullName:fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email:email,
        password:password,
        username:username.toLowerCase()
    }
    )
   const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
   )


});

module.exports = { registerUser }; // Ensure it's exported as an object