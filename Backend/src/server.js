
import dotenv from "dotenv";
import { app } from "./app.js";
import db from "./db/index.js";
dotenv.config();

const PORT = process.env.PORT || 1010;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
