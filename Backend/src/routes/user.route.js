import { Router } from "express";
import { registeruser, loginAuth, logoutAuth, updatePassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router =Router()

router.route("/register").post(registeruser)
router.route("/login").post(loginAuth)

// secured routes 
router.route("/logout").post(verifyJWT, logoutAuth)
router.post("/updatepass", verifyJWT, updatePassword);


export default router
