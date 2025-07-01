// controllers/verifyController.ts
import { NextFunction, Request, Response } from "express";
import { sendOtpEmail } from "../services/email.service";
import { generateOtp, saveOtp, verifyOtp } from "../services/otpService";
import errResponse from "../utils/errResponse";
import sucResponse from "../utils/sucResponse";
import { Client } from "../models/client.model";


//Send OTP 
export const sendOtp = async (req: Request, res: Response): Promise<void> => {

  try {

    //Get User Email Id and Password
    const { email } = req.body;

    if(!email){
      throw new errResponse("Invalid Inputs",400)
    }

    //Verfiy if user already exist with same email or username
    const usr = await Client.find({email})

    if(usr.length > 0){
      throw new errResponse("Email or Username Already Exist",400)
    }

    //Generate OTP
    const otp = generateOtp();

    if(!otp){
      throw new errResponse("Internal Server Error",500)
    }

    //Get OTP response and check wether it is empty or not
    const OTPresponse = await saveOtp(email, otp);

    if(!OTPresponse){
      throw new errResponse("Internal Server Error",500)
    }
    
    await sendOtpEmail(email, otp);

    res.json(new sucResponse(true,200,"OTP sent"));

  } catch (err: any) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

export const verifyOtpHandler = async (
  req: Request,
  res: Response,
  next:NextFunction
): Promise<void> => {

  try {

    const { email, otp } = req.body;

    if(!email || !otp){
      throw new errResponse("Invalid Inputs",400)
    }

    const isValid = await verifyOtp(email, otp);

    if (!isValid) {
      throw new errResponse("Invalid or Expired OTP",400)
    }

    res.json(new sucResponse(true,200,"Email verified successfully"));

  } catch (err) {
    next(err)
  }
};
