// import { Request, Response, NextFunction } from "express";
import { Client } from "../models/client.model";
import { Editor } from "../models/editor.model";
import { Otp } from "../models/otp.model";
import errResponse from "../utils/errResponse";

const checkEmailVerified = async (req: any, res: any, next: any) => {
  try {
    const { email , otp } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await Otp.findOne({ email , otp , 
      expiresAt : {
        $gt: Date.now()
      }
    });

    if (!user) {
      throw new errResponse("Invalid Inputs",400)
    }

    if (user.verified !== true) {
      return res.status(403).json({ message: "Email is not verified." });
    }

    let usr = await Client.findOne({
      email
    })

    if(!usr){
      usr = await Editor.findOne({
        email,
      })
    }

    if(usr){
      throw new errResponse("User Already Exist",400)
    }

    next();
  } catch (error) {
    next(error)
  }
};

export default checkEmailVerified;
