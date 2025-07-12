import { NextFunction, Request, Response } from "express";
import errResponse from "../utils/errResponse";
import { Code } from "../models/dev-code.model";
import crypto from "crypto"
import dotenv from "dotenv"
import sucResponse from "../utils/sucResponse";
import { Client } from "../models/client.model";
import { sendCouponEmail } from "../services/email.service";

dotenv.config()

export const generateDevCouponCode = async (req:Request,res:Response,next:NextFunction) => {

    try {

        const {email} = req.body;

        if(!email){
            throw new errResponse("Invalid Inputs",400)
        }

        const emailExist = await Client.findOne({email})
        
        if(emailExist){
            throw new errResponse("User Exist with this email",400)
        }

        //Check If any coupon code exist with same email
        const emailEntityExist = await Code.findOne({email})

        if(emailEntityExist){
            throw new errResponse("Email has already been setup for coupun code",400)
        }

        //Generate Some Code
        const couponCode = createCouponCode(email)

        if(!couponCode){
            throw new errResponse("Internal Server Error",500)
        }

        //Add it in database email and Code
        const codeObject = await Code.create({
            email,
            code:couponCode
        })

        if(!codeObject){
            throw new errResponse("Internal Server Error",500)
        }

        //Send Email to Reciever
        await sendCouponEmail(email,couponCode);
        //Send Success Response
        res.json( new sucResponse(true,200,"Coupon Code Created Successfully"))
        
    } catch (error) {
        next(error)
    }

}

function createCouponCode(input:string){

    const payload = `${input}+/${process.env.SALT}+/${process.env.COUPON_SECRET}`
    const hash = crypto.createHash("sha256")
    const code = hash.update(payload).digest('hex')
    return code
}