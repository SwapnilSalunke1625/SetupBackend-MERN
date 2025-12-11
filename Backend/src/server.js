import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
dotenv.config()

const PORT=process.env.PORT || 1010
const app=express()


connectDB()