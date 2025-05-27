import sucResponse from "../utils/sucResponse"
import { Client } from "../models/client.model"
import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"
import e from "express"

// Routes Authorized to Youtubers only

export const addEditor = async (req:any , res:any , next:any) => {

    try {

        const {editorId , teamId} = req.body 

        const editor = await Client.findById(editorId).select("+role")

        if(!editor){
            throw new errResponse("No Such user exists",400)
        }

        if(editor.role != "EDITOR"){
            throw new errResponse("Invalid Request",400)
        }

        const team : any = await Team.findByIdAndUpdate(
        teamId ,
        {  
            $addToSet: { editor : editorId}
        },
        {new:true}) 
 

        if(!team){
            throw new errResponse("Something went wrong",500)
        }

        return res.json(new sucResponse(true,200,"Editor added success",team))
        
    } catch (error) {
        next(error)
    }

}

export const removeEditor = async (req:any ,res:any ,next:any) => {
    try {
        
            const {editorId ,teamId} = req.body 
        
            const editor = await Client.findById(editorId).select("+role")
        
            if(!editor){
                throw new errResponse("No Such user exists",400)
            }
        
            if(editor.role != "EDITOR"){
                throw new errResponse("Invalid Request",400)
            }
        
            const team = await Team.findByIdAndUpdate(
                teamId,
                {
                    $pull : {editor:editorId}
                },
                {new:true}
            )
        
            if(!team){
                throw new errResponse("No Team found",400)
            }

            return res.json(new sucResponse(true ,200 , "Editor Removed Success",team))

    } catch (error) {
            next(error)
    }

}

// Getting all Editors

export const getAllEditors = async (req:any,res:any,next:any)=>{

   try {
        const editors = await Client.find({
            role:"EDITOR"
        })

        if(!editors){
            throw new errResponse("Editors not availabe",400)
        }

        return res.json(new sucResponse(true,200,"Editors fetched sucesss",editors))

   } catch (error) {
        next(error)
   }

}

// Get Single Editor
export const getEditor = async (req:any,res:any,next:any)=>{

    try {
        const {editorId} = req.params
    
        if(!editorId){
            throw new errResponse("Editor id missing",400)
        }
    
        const editor = await Client.findById(editorId)
    
        if(!editor){
            throw new errResponse("No editor exist",400)
        }
    
        return res.json(new sucResponse(true,200,"Editor fetched sucess",editor))

    } catch (error) {
        next(error)
    }

}