import { Client } from "../models/client.model";
import { Editor } from "../models/editor.model";
import { Otp } from "../models/otp.model";
import errResponse from "../utils/errResponse";

const checkEmailVerified = async (req: any, res: any, next: any) => {

  try {

    //While getting the request get email and OTP from user
    const { email , otp } = req.body;

    if (!email || !otp ) {
      throw new errResponse("Invalid Inputs",400)
    }
    
    //Check if the email already belong to a user
    let userExist = await Client.findOne({email});

    if(!userExist){
      userExist = await Editor.findOne({email})
    }

    if(userExist){
      throw new errResponse("Invalid Request",400)
    }

    //Check DB and find the entry which matches the email and password and has OTP verified
    const user = await Otp.findOne({ email , otp ,
      expiresAt : {
        $gt: Date.now()
      }
    });

    if (!user) {
      throw new errResponse("Invalid Email or OTP or OTP has expired",400)
    }

    if (user.verified !== true) {
      return res.status(403).json({ message: "Email is not verified." });
    }

    //The flow will pass where dev code will be verified
    next();
    
  } catch (error) {
    next(error)
  }
};

export default checkEmailVerified;
