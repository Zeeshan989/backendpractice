import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {uploadResult} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/users.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import mongoose from "mongoose";


const registerUser = asyncHandler(async (req, res) =>  {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const {fullName, email, username, password } = req.body
    //console.log("email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
   

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadResult(avatarLocalPath)
    const coverImage = await uploadResult(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    console.log('Data is inserted in DB')

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    console.log('Request File   :',req.files)

    return res.status(201).json(
       
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    
});

const loginUser = asyncHandler(async (req, res) =>  {



    const {username,password} = req.body
    //console.log("email: ", email);
    console.log(username);
    console.log(password);

    if (
        [username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const matchUser = await User.findOne({
        username 
    })

    if (!matchUser) {
        throw new ApiError(409, "Invalid username")
    }
    else{
   

   const passresult=await matchUser.isPasswordCorrect(password)
   if(passresult==false){throw new ApiError(400,'Invalid Password')}
   else{
    const accesstoken=matchUser.generateAccessToken()
    const refreshtoken=matchUser.generateRefreshToken()
    await matchUser.saveRefreshtoken(refreshtoken);

    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken",accesstoken,options)
    .cookie("refreshToken",refreshtoken,options)
    .json(
        new ApiResponse(200,{},'User Authenticated')
    )
    

}
   
    }

});

const logoutUser=asyncHandler(async (req, res) =>  {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshtoken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))



})

const refreshToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

    const decodedToken=jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const user=await User.findById(decodedToken?._id)
    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
        
    }
    const options = {
        httpOnly: true,
        secure: true
    }
    const accessToken = user.generateAccessToken()
    const newrefreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
            accessToken,refreshToken:newrefreshToken
            },
            "Access token refreshed"
        )

    )



}

)

const Updatepassword=asyncHandler(async(req,res)=>{

    const {oldpassword,newpassword} = req.body

    const usr=await User.findById(
        req.user._id
    )
    const passmatch=await usr.isPasswordCorrect(oldpassword)
   if(passmatch==false){throw new ApiError(400,'Wrong Current Password')}
   else{
        usr.password=newpassword
        await usr.save();
        
    };

    return res.status(200)
    .json(
        new ApiResponse(
            200,{},'Password Updated Successfully'
        )
    )

   }
)

const UpdateAvatar=asyncHandler(async(req,res)=>{
    console.log(req.file)
    
    const newavatarLocalPath = req.file?.path;
    if (!newavatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const newavatar = await uploadResult(newavatarLocalPath)
    const usrr=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: newavatar.url
            }
        },
        {new: true}
    ).select("-password")
    throw new ApiResponse(200,{},'Updated avatar')


   }
)

    








export {
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    Updatepassword,
    UpdateAvatar
} // Ensure it's exported as an object