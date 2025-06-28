import { Router } from "express";

import { sendOtp, verifyOtpHandler } from "../controller/otp.controller";
const router = Router()

router.route('/send-otp').post(sendOtp)
router.route('/verify-otp').post(verifyOtpHandler)



export default router