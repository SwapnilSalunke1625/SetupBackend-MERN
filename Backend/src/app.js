import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

// cofiguration


// kon konsa origin hum alllow kare bat karne ko server se
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// limit lagaya takin server pe isse jyada data na aaye protectectoon for crashing
// json data is taking and atmost 16kb
app.use(express.json({limit:"16kb"}))

// url se data lena hai islie
app.use(express.urlencoded({extended: true, limit:"16kb"}))

app.use(express.static("public"))

// server se cookie acces karna and store karna remove karna server se hi
app.use(cookieParser())

export {app}