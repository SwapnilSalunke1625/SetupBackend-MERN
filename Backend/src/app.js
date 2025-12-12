import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()


// middlewares for configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// Routes
import userRouter from "./routes/user.route.js"
app.use("/api/v1/users", userRouter)
// https://localhost:8000/api/v1/users/register

export {app}