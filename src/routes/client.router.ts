import { Router } from "express";
import {
  changePassword,
  IAM,
  logout,
  signin,
  signup,
} from "../controller/client.controller";
import { authMiddleware, isYoutuber } from "../middleware/auth.middleware";
import checkEmailVerified from "../middleware/verification.middleware";

const router = Router();

router.route("/signup").post(checkEmailVerified, signup);
router.route("/signin").post(signin);
router.route("/logout").post(authMiddleware, logout);
router.route("/IAM").get(authMiddleware, IAM);

router
  .route("/changePassword")
  .post(authMiddleware, isYoutuber, changePassword);

export default router;
