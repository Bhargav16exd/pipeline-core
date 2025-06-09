import jwt from "jsonwebtoken"
import { Client } from "../models/client.model"
import errResponse from "../utils/errResponse"
import { Editor } from "../models/editor.model"

export const authMiddleware = async (req:any,res:any,next:any)=>{

    try {

          let token
          token  = req.cookies.token
          const JWT_SECRET = process.env.JWT_SECRET as any 

          if(!token){
            token = req.header("Authorization").split(" ")[1]
          }

      //  const token = req.header("Authorization").split[" "] req.header("Authorization") gives single header req.headers give all headers 

          if(!token){
            throw new errResponse("Unauthenticated",400)
          }

          const {_id} : any = jwt.verify(token,JWT_SECRET)

          if(!_id){
            throw new errResponse("Unauthenticated",400)
          }

          let client: any = await Client.findById(_id).select("+role")

          if(!client){
            client = await Editor.findById(_id).select("+role")
          }

          if(!client){
            throw new errResponse("User not found",400)
          }

          req.user = client
          next()
        
    } catch (error) {

        next(error)
    }

}

export const isYoutuber = async (req:any ,res:any ,next:any)=>{

  try {

    if(req.user.role != "YOUTUBER"){
      throw new errResponse("Not Authorized",400)
    }
    next()
     
  } catch (error) {
    next(error)
  }

}

export const isEditor = async (req:any,res:any,next:any)=>{

  try {

    if(req.user.role != "EDITOR"){
      throw new errResponse("Not Authorized",400)
    }
    next()
     
  } catch (error) {
    next(error)
  }

}