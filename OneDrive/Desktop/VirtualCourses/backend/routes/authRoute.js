import express from "express"
import { googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/authController.js"
import isAuth from "../middlewares/isAuth.js"   // ✅ use your middleware
import User from "../models/userModel.js"              // ✅ needed

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/googlesignup", googleSignup)
authRouter.post("/sendotp", sendOtp)
authRouter.post("/verifyotp", verifyOtp)
authRouter.post("/resetpassword", resetPassword)

// ✅ IMPORTANT: ADD THIS ROUTE
authRouter.get("/me", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" })
  }
})

export default authRouter