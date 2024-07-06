express=require('express')
dotenv=require('dotenv').config()


connectDB=require('./db/index.js')


connectDB()