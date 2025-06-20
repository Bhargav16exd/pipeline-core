import sucResponse from "../utils/sucResponse"
import { Client } from "../models/client.model"
import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"
import { Editor } from "../models/editor.model"
import { uploadImageToAwsS3} from "../services/upload.profile"
import { passwordChangeAlert } from "../services/email.service"



export const signup = async (req:any,res:any,next:any) => {

   try {
    
    const { name , about , yearsOfExperience, location, username , email , password } = req.body
    const profilePicture = req.file
 
    if(!name || !about || !yearsOfExperience || !location || !username || !email || !password || !profilePicture ){
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
        about,
        yearsOfExperience,
        location,
        profile:url,
        isInTeam:false
    })
 
    await editor.save()
    return res.json(new sucResponse(true,200,"Account Created Successfully"))

   } catch (error) { 
      next(error)
   }
}

/*
    Endpoint : /api/team/exit
    Working  : Editor Can Exit the Team
*/

export const exit = async (req:any ,res:any ,next:any) => {
    try {
        
            const {teamId} = req.body 

            const { _id : editorId} = req.user
        
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

            return res.json(new sucResponse(true ,200 , "Team Exit Success",team))

    } catch (error) {
            next(error)
    }

}

/*
    Endpoint : /api/team/editors/:skip
    Working  : Get All Editors Paginated
*/


export const getAllEditors = async (req:any,res:any,next:any)=>{

   try {

        const {skip} = req.params
        const limit = 10 

        const editors = await Editor.find({
            role:"EDITOR"
        }).limit(limit).skip(skip)

        if(!editors){
            throw new errResponse("Editors not availabe",400)
        }

        return res.json(new sucResponse(true,200,"Editors fetched sucesss",editors))

   } catch (error) {
        next(error)
   }

}

/*
    Endpoint : /api/team/editor/:id
    Working  : Search Editor Based on Its Id
*/

// Get Editor Profile
export const getEditor = async (req:any,res:any,next:any)=>{

    try {
        const {id:editorId} = req.params
    
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

/*
    Endpoint : /api/team/search/:name
    Working  : Search Editor Based on Its Username
*/

export const search = async (req:any,res:any,next:any)=>{

    try {

        console.log(req.params)

        const {name} = req.params


        if(!name || !name.trim()){
            throw new errResponse("Empty Inputs",400)
        }

        const editors = await Editor.find({
            name: {
                $regex: new RegExp(name),
            },
            role:"EDITOR"
        })


        if(editors.length == 0 ){
            return res.json(new sucResponse(true,204,"No Editors Found"))
        }

        return res.json(new sucResponse(true,200,"Editors Fetched Success",editors))


    } catch (error) {
        next(error)
    }
}

/*
    Endpoint : /api/editor/changePassword
    Working  : Search Editor Based on Its Username
*/

export const changePassword = async (req:any,res:any,next:any) => {
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

        return res.json(new sucResponse(true,201,"Password Change Success"))

    } catch (error) {
        next(error)
    }
}


/*
    Endpoint : /api/editor/update
    Working  : Search Editor Based on Its Username
*/
export const update = async (req:any,res:any,next:any) => {

   try {
    
    const { name , about , yearsOfExperience, location } = req.body
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
        about,
        yearsOfExperience,
        location,
        profile:url
    },{new:true})

    if(!editor){
        throw new errResponse("Internal Server Error",500)
    }

    return res.json(new sucResponse(true,200,"Updated Profile Successfully"))

   } catch (error) { 
      next(error)
   }
}