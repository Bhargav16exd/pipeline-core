import { Router } from "express";
import {
  changePassword,
  IAM,
  logout,
  signin,
  signupUsingCode,
} from "../controller/client.controller";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";
import checkEmailVerified from "../middleware/verification.middleware";
import checkDevCodeVerified from "../middleware/devcode.verification";
import errResponse from "../utils/errResponse";


const router = Router();

/*
  ROUTE : /api/client
  Working : Any Request to above route is redirected here
*/

//router.route("/signup").post(checkEmailVerified, signup);
router.route("/signin").post(signin);
router.route("/logout").post(authMiddleware, logout);
router.route("/IAM").get(authMiddleware,IAM);

//Sign Up Youtuber using developer code
router.route("/code/signup").post(checkEmailVerified,checkDevCodeVerified,signupUsingCode)
router.route("/changePassword").post(authMiddleware, isYoutuber, changePassword);

export default router;
