import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
dotenv.config()

const PORT=process.env.PORT || 1010

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is running on port : ${PORT}`)
    })
})
.catch((error)=>{
    console.log("MONGODB CONNECTION FAILED !!!", error)
})