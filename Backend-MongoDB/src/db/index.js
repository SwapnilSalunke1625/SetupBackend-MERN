// MOngoDB Connection setup 
// import mongoose from "mongoose"
// import { DB_NAME } from "../constants.js"

// const connectDB= async()=>{
//     try {
//         const connetionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST : ${connetionInstance.connection.host}`)
//     } catch (error) {
//         console.log("MONGODB CONNECTION FAILED!!", error)
//         process.exit(1)
        
//     }
// } 

// export default connectDB;


import mysql from "mysql2"
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed!", err);
    return;
  }
  console.log("✅ Connected to MySQL Database");
  connection.release();
});

export default db;