import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import db from "../db/index.js";
import bcrypt from "bcrypt"

const registeruser= asyncHandler(async (req, res)=>{

    const {name,email, password, address}=req.body
    console.log("email : ", email)

    if([name, email, address, password].some((field)=> field?.trim()==="")){
            throw new ApiError(400, "All fields are required")
        }   

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            "Password must be 8–16 characters, include at least 1 uppercase letter and 1 special character"
        );
    }
    // user exist or not    
    const [ExistUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);   
    if (ExistUser.length > 0) {
        throw new ApiError(409, "User already exists with this email");
    }

    const hashPassword=await bcrypt.hash(password, 10);

    const [result] = await db.promise().query(
        "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)",
        [name, email, hashPassword, address]
    );

     if (result.affectedRows === 0) {
        throw new ApiError(500, "Failed to create user");
    }

    console.log("New User Inserted:");
    console.log({
        id: result.insertId,
        name,
        email,
        address,
        hashPassword,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            id: result.insertId,
            name,
            email,
            address
        },
    });



    

    // get data from body
    // validation adds
    // check if user already exist 
    // create user object - create entry in DB
    // remove password and refresh token field
    // check for user creation
    // return res

   
})

export {registeruser}