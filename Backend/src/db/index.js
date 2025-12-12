import mysql from "mysql2"
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: DB_NAME
});

// Connection
db.getConnection((err, connection) => {
  if (err) {
    console.log("Database connection failed!", err);
    return;
  }
  console.log("Connected to MySQL Database");
  connection.release();
});

export default db;