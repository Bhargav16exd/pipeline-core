import { NextFunction, Request, Response } from "express"
import { io } from "../app"
import jwt from "jsonwebtoken"
import errResponse from "../utils/errResponse"
import { Client } from "../models/client.model"
import dotenv from "dotenv"
import { UploadLogs } from "../models/upload.logs"
import sucResponse from "../utils/sucResponse"

dotenv.config()

const JWT_SECRET : any = process.env.JWT_SECRET

let socket : any ;

export default async function ListenToSocket(){

    io.use(async(socket,next)=>{

        try {

            const token = socket.handshake.auth.token 

            const validatedUser : any = jwt.verify(token,JWT_SECRET)

                    
            if(!validatedUser){
                throw new errResponse("Unauthenticated",400)
            }
            
            const user : any = await Client.findById(validatedUser._id)
            
            if(!user){
               throw new errResponse("Internal Server Error",500)
            }
            
            //@ts-ignore
            socket.user = user 
            next()

        } catch (error) {
            console.log(error)   
        }
    })

    
    io.on("connection", async (socket) => {

        const someId : any = socket.handshake.query.id

        socket.join(someId)

    })

}

export const latest : any = async (req : Request, res :Response , next:NextFunction) => {

    try {
        
        const {id} = req.params

        if(!id){
            throw new errResponse("Empty Inputs",400)
        }

        const statusLogs = await UploadLogs.findOne({videoId:id})

        if(!statusLogs){
            throw new errResponse("Invalid Input",400)
        }

        return res.json(new sucResponse(true,200,"Fetched Latest Data",statusLogs))

    } catch (error) {
        next(error)
    }
}

export {
    socket
}