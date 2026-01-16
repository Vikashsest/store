import express from "express";
import checkAuth from "../middlewares/authMiddleware.js";
import {
  getCurrentUser,
  login,
  logout,
  register,
  verifyOtp,
  // sendOtp,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/", checkAuth, getCurrentUser);

router.post("/logout", logout);
router.post("/verifyOtp", verifyOtp);
// router.post("/send-otp", sendOtp);
export default router;
