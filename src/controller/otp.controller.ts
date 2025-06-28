// controllers/verifyController.ts
import { Request, Response } from "express";
import { sendOtpEmail } from "../services/email.service";
import { generateOtp, saveOtp, verifyOtp } from "../services/otpService";

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;

    const user = { email, username };
    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(user, otp);
    res.status(200).json({ message: "OTP sent" });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

export const verifyOtpHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username, email, otp } = req.body;
    const isValid = await verifyOtp(email, otp);
    if (!isValid) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }
    res.status(200).json({ message: "Email verified successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Verification failed", error: err.message });
  }
};
