import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { generateDevCouponCode } from "../controller/dev-code.controller";



const router = Router()

router.route('/generate-code').post(authMiddleware,generateDevCouponCode)

export default router;