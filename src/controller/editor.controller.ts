import sucResponse from "../utils/sucResponse"
import { Client } from "../models/client.model"
import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"


// Routes Authorized to Youtubers only


/*
    Endpoint : /api/team/addEditor
    Working  : Add Editor To the Team
*/

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

/*
    Endpoint : /api/team/removeEditor
    Working  : Remove Editor from the team
*/

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

        const editors = await Client.find({
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
    Endpoint : /api/team/search/:username
    Working  : Search Editor Based on Its Username
*/

export const search = async (req:any,res:any,next:any)=>{

    try {

        const {username} = req.params

        if(!username || !username.trim()){
            throw new errResponse("Empty Inputs",400)
        }

        const editors = await Client.find({
            username: {
                $regex: new RegExp(username),
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