import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import db from "../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const accessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    await db
      .promise()
      .query("UPDATE users SET refreshToken = ? WHERE id = ?", [
        refreshToken,
        userId,
      ]);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registeruser = asyncHandler(async (req, res) => {
  // step 01: fetch data from frontend
  const { name, email, password, address } = req.body;

  // step 02 : validations
  if ([name, email, address, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
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

  // Step 03: Check user exist or not
  const [ExistUser] = await db
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
  if (ExistUser.length > 0) {
    throw new ApiError(409, "User already exists with this email");
  }

  // step 04: Make password hash and store userdara into DB

  const hashPassword = await bcrypt.hash(password, 10);

  const [result] = await db
    .promise()
    .query(
      "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)",
      [name, email, hashPassword, address]
    );

  if (result.affectedRows === 0) {
    throw new ApiError(500, "Failed to create user");
  }

  // Confirmation console window
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
      address,
    },
  });
});

const loginAuth = asyncHandler(async (req, res) => {
  // step 01: fetch data from frontend
  const { email, password } = req.body;

  // step 02 : validations
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // step 03 : Check if user exists
  const [userRows] = await db
    .promise()
    .query("SELECT * FROM users WHERE email = ?", [email]);
  if (userRows.length === 0) {
    throw new ApiError(404, "User is not registered! Please register first");
  }

  // step 04 : if exist then match password
  const user = userRows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user.id
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  // step 05 : Confirmation
  console.log("User Logged in", {
    email: user.email,
    role: user.role,
  });

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
        "user logged In Successfully"
      )
    );
});

const logoutAuth = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Print user info before logout
  console.log("User Logged Out:", {
    email: req.user.email,
    role: req.user.role,
  });

  // Remove refreshToken from database
  await db
    .promise()
    .query("UPDATE users SET refreshToken = NULL WHERE id = ?", [userId]);

  // response
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {

  const userId = req.user?.id;

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password & new password are required");
  }

  //Fetch user from database
  const [rows] = await db
    .promise()
    .query("SELECT id, password FROM users WHERE id = ?", [userId]);

  if (rows.length === 0) {
    throw new ApiError(404, "User not found");
  }
  const user = rows[0];

  // Password matching
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }

  // hashpassword and store
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db
    .promise()
    .query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);

    console.log("Password is updated successfully:");

  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

export { registeruser, loginAuth, logoutAuth, updatePassword };
