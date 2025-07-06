import { Router } from "express";
import { sendOtp, verifyOtpHandler } from "../controller/otp.controller";

const router = Router()

/*
    ROUTE : /api/otp
    Working : Any Request to above route is redirected here
*/

router.route('/send-otp').post(sendOtp)
router.route('/verify-otp').post(verifyOtpHandler)



export default router