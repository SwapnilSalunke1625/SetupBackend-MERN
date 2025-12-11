import express from "express"
import dotenv from "dotenv"
dotenv.config()

const PORT=process.env.PORT || 1010
const app=express()

app.get("/", (req,res)=>{
    res.send("server is live ....")
})


app.listen(PORT || 1010 ,()=>{
    console.log(`server is running at port : ${PORT}`)
})