import sucResponse from "../utils/sucResponse"
import { Client } from "../models/client.model"
import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"
import { Editor } from "../models/editor.model"
import { uploadImageToAwsS3} from "../services/upload.profile"
import { passwordChangeAlert } from "../services/email.service"
import { add } from "./teamController"
import { NextFunction, Request, Response } from "express"


/*
    Endpoint : TBD
    Working  : Editor Signup
*/
export const signup = async (req:Request,res:Response,next:NextFunction) => {
   try {

    if(!req.team) throw new errResponse("Invalid Requeset",500)
    
    const { name , username , email , password } = req.body
    const profilePicture = req.file
 
    if(!name || !username || !email || !password || !profilePicture ){
       throw new errResponse("Kindly Provide all arguments" , 400 )
    }
 
    const editorExist = await Editor.findOne({username:username})
 
    if(editorExist){
        throw new errResponse("Username already exists",400)
    }

    const url = await uploadImageToAwsS3(profilePicture)

    if(!url){
        throw new errResponse("Internal Server Error",500)
    }

    //Get Uploaded URL
    const editor = await Editor.create({
        name,
        username,
        password,
        email,
        profile:url,
        isInTeam:false
    })
 
    await add(editor.username,req.team._id)

    await editor.save()
    res.json(new sucResponse(true,200,"Account Created Successfully"))

   } 
   catch (error) { 
     next(error)
   }
}

/*
    Endpoint : /api/team/exit
    Working  : Editor Can Exit the Team
*/

export const exit = async (req:Request ,res:Response ,next:NextFunction) => {

    if(!req.user)throw new errResponse("Invalid Request",400)

    try {

        const {teamId} = req.body 

        const { _id : editorId} = req?.user
    
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

        res.json(new sucResponse(true ,200 , "Team Exit Success",team))

    } catch (error) {
        next(error)
    }

}


/*
    Endpoint : /api/team/editor/:id
    Working  : Search Editor Based on Its Id
*/

// Get Editor Profile
export const getEditor = async (req:any,res:Response,next:NextFunction)=>{

    try {
        const {id:editorId} = req.params
    
        if(!editorId){
            throw new errResponse("Editor id missing",400)
        }
    
        const editor = await Client.findById(editorId)
    
        if(!editor){
            throw new errResponse("No editor exist",400)
        }
    
        res.json(new sucResponse(true,200,"Editor fetched sucess",editor))

    } catch (error) {
        next(error)
    }

}

/*
    Endpoint : /api/editor/changePassword
    Working  : Search Editor Based on Its Username
*/

export const changePassword = async (req:any,res:Response,next:NextFunction) => {

    if(!req.user){
        throw new errResponse("Invalid Request",500)
    }

    try {
        
        const { oldPassword , newPassword } = req.body

        if( !oldPassword || !oldPassword.trim() || !newPassword || !newPassword.trim() ){
            throw new errResponse("Incomplete Inputs", 400)
        }

        const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/;

        if(!regex.test(newPassword)){
            throw new errResponse("Password must be 8-20 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and no spaces.",400)
        }

        const editor = await Editor.findById(req.user._id).select("+password")

        if(!editor){
            throw new errResponse("No User Found",400)
        }

        const isMatch = await editor.isPasswordValid(oldPassword)

        if(!isMatch){
            throw new errResponse("Incorrect Password",400)
        }

        editor.password = newPassword

        await editor.save()

        await passwordChangeAlert(editor)

        res.json(new sucResponse(true,201,"Password Change Success"))

    } catch (error) {
        next(error)
    }
}


/*
    Endpoint : /api/editor/update
    Working  : Update Editor
*/
export const update = async (req:any,res:Response,next:NextFunction) => {

   try {

    if(!req.user){
        throw new errResponse("Invalid Request",400)
    }
    
    const { name } = req.body
    const profilePicture = req.file
    let url;   
    
    if(profilePicture){
        url = await uploadImageToAwsS3(profilePicture)
        if(!url){
            throw new errResponse("Internal Server Error",500)
        }
    }

    const editor = await Editor.findOneAndUpdate({
        _id:req.user._id
    },{
        name,
        profile:url
    },{new:true})

    if(!editor){
        throw new errResponse("Internal Server Error",500)
    }

    res.json(new sucResponse(true,200,"Updated Profile Successfully"))

   } catch (error) { 
      next(error)
   }
}