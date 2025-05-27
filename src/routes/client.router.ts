import { Router } from "express";
import { IAM, logout, signin, signup } from "../controller/client.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router()

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/logout').post(authMiddleware,logout)
router.route('/IAM').get(authMiddleware,IAM)



export default router