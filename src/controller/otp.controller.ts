// controllers/verifyController.ts
import { NextFunction, Request, Response } from "express";
import { sendOtpEmail } from "../services/email.service";
import { generateOtp, saveOtp, verifyOtp } from "../services/otpService";
import errResponse from "../utils/errResponse";
import sucResponse from "../utils/sucResponse";
import { Client } from "../models/client.model";
import { Editor } from "../models/editor.model";


//Send OTP 
export const sendOtp = async (req: Request, res: Response,next:NextFunction): Promise<void> => {

  try {

    console.log(req.body)

    //Get User Email Id and Password
    const { email } = req.body;

    if(!email){
      throw new errResponse("Invalid Inputs",400)
    }

    //Verfiy if youtuber already exist with same email or username
    let usr = await Client.findOne({email})

    if(!usr){
      usr = await Editor.findOne({email})
    } 

    if(usr){
      throw new errResponse("Already Registered Email",400)
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
    next(err)
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
