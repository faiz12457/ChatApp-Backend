import express from "express";
import { signUpController } from "../controllers/authControllers/signUpController.js";
import { loginController } from "../controllers/authControllers/loginController.js";
import { logoutController } from "../controllers/authControllers/logoutController.js";
import { refreshController } from "../controllers/authControllers/refreshController.js";
import { forgetPasswordController } from "../controllers/authControllers/forgotPassword.js";
import { verifyOtpController } from "../controllers/authControllers/verifyOpt.js";
import { resetPasswordController } from "../controllers/authControllers/resetPassword.js";
import { getOtpController } from "../controllers/authControllers/getOtp.js";
import { verifyAccessToken } from "../middlewares/verifyAccessToken.js";
import { getUserController } from "../controllers/authControllers/getUserController.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post('/refresh',refreshController)
router.post("/forgotPassword",forgetPasswordController)
router.post("/verifyOtp",verifyOtpController)
router.post("/resetPassword",resetPasswordController);
router.post("/getOtp",getOtpController);
router.get("/getUser",verifyAccessToken,getUserController);
export default router;
