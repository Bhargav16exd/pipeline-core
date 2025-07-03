import { NextFunction, Request, Response } from "express";
import errResponse from "../utils/errResponse";
import { Code } from "../models/dev-code.model";


export const generateDevCouponCode = async (req:Request,res:Response,next:NextFunction) => {

    try {

        const {email} = req.body;

        if(!email){
            throw new errResponse("Invalid Inputs",400)
        }

        const emailEntityExist = await Code.findOne({email})

        if(!emailEntityExist){
            throw new errResponse("Email has already been setup for coupun code",400)
        }

        //Generate Some Code
        //Add it in database email and Coce
        //Send Email to Reciever
        //Send Success Response
        
    } catch (error) {
        next(error)
    }

}