import { NextFunction } from "express";
import { Code } from "../models/dev-code.model";
import errResponse from "../utils/errResponse";


const checkDevCodeVerified = async (req: any, res: any, next:any) => {

  try {

    //While getting the request get email and OTP from user
    const { email , code } = req.body;

    if(!code){
        throw new errResponse("Invalid Code",400)
    }

    //Get Code Object from database by email and verify the code
    const codeObject = await Code.findOne({email})

    //Check if email given is eligible for Coupun Code
    if(!codeObject){
      throw new errResponse("Account not eligible for Dev Coupon Code",400)
    }
    
    //Check if code is redeemed
    if(codeObject.redeemed === true){
      throw new errResponse("Code is already Redeemed , if not by you contact Admin" , 400 )
    }

    //If valid code then next else throw error
    if(code !== codeObject.code){
      throw new errResponse("Invalid Dev Coupun Code",400)
    }

    //dev Code is Verified 
    next();
    
  } catch (error) {
    next(error)
  }
};

export default checkDevCodeVerified;