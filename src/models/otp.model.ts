import mongoose from "mongoose";

export interface OTP  {
  email : String,
  otp : String ,
  expiresAt : Date,
  verified : Boolean
}

const otpSchema = new mongoose.Schema({

  email:{ 
    type: String,
    required: true 
  },
  otp:{ 
    type: String,
    required: true 
  },
  expiresAt:{
    type: Date, 
    required: true 
  },
  verified:{ 
    type: Boolean, 
    required: true,
    default:false
  }
},{ timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);
