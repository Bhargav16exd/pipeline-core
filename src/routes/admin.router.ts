import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { generateDevCouponCode } from "../controller/dev-code.controller";

const router = Router()

/*
    ROUTE : /api/admin
    Working : Any Request to above route is redirected here
*/
router.route('/generate-code').post(authMiddleware,generateDevCouponCode)

export default router;