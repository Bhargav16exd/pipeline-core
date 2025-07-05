import { Client } from "../models/client.model"
import { Editor } from "../models/editor.model"
import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { alertEditor_editorAddedToTeam, alertEditor_editorRemovedFromTeam, alertYoutuber_AddedEditorToTeam, alertYoutuber_RemovedEditorFromTeam} from "../services/email.service"
import errResponse from "../utils/errResponse"
import sucResponse from "../utils/sucResponse"


export const info = async (req:any,res:any,next:any)=>{
    
    try {
        
        const { teamId } = req.params

        if(!teamId){
            throw new errResponse("Invalid Inputs",400)
        }

        const team = await Team.findById(teamId).populate('editor')

        if(!team){
            throw new errResponse("Invalid Team Id" , 400)
        }

        const editorUploadData : any = await Promise.all(team.editor.map(async (editor:any)=>{

            const video = await Video.find({uploadedBy:editor._id})
            const videoUploaded = video.length;

            let videoPending = 0;
            let videoApproved = 0;

            video.map((el:any)=>{

                if(el.pending == true){
                    videoPending++;
                }
                if(el.approved == true){
                    videoApproved++;
                }

            })

            return {
                videoUploaded:videoUploaded,
                videoPending,
                videoApproved
            };
            


        }))

        
        return res.json(new sucResponse(true,200,"Team Fetched Success",{team,editorUploadData}))
        

    } catch (error) {
        next(error)
    }
}

// Routes Authorized to Youtubers only

/*
    Endpoint : /api/team/addEditor
    Working  : Add Editor To the Team
*/

export const addEditor = async (req:any , res:any , next:any) => {


    try {

        //Get Inputs
        const {username , teamId} = req.body 

        //Check if inputs are empty
        if(!username || !teamId){
            throw new errResponse("Invalid Inputs",400)
        }
      
        //Call Add Helper Function
        const {editor,team} = await add(username,teamId)

        //Notify Youtuber as well as Editor
        await alertYoutuber_AddedEditorToTeam(req.user,editor)
        await alertEditor_editorAddedToTeam(editor,team)

        //Send Response
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
        
            const editor = await Editor.findByIdAndUpdate(editorId,{
                isInTeam:false,
                teamId:null
            }).select("+role")
        
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

            await alertYoutuber_RemovedEditorFromTeam(req.user,editor)
            await alertEditor_editorRemovedFromTeam(editor,team)

            return res.json(new sucResponse(true ,200 , "Editor Removed Success",team))

    } catch (error) {
            next(error)
    }

}

/*
    Endpoint : /api/team/stats/:teamId
    Working  : Give Stats of Dashboard
*/

export const stats = async (req:any,res:any,next:any) => {

    try {

     
        const team = await Team.findById(req.user.teamId)

        if(!team){
            throw new errResponse("Invalid Team Info",400)
        }

        const videos = await Video.find({teamId:team._id,cloudUploadStatus:"UPLOADED"})
        
        let totalVideos 
        let pendingVideosCount = 0
        let approvedVideosCount = 0

        if(!videos){
            totalVideos = 0
        }else{
            totalVideos = videos.length
        }


        if( totalVideos > 0 ){

            const pendingVideos = videos.filter((video)=> (video.pending == true && video.approved == true))
            const approvedVideos = videos.filter((video)=> (video.pending == false && video.approved == true))

            pendingVideosCount = pendingVideos.length > 0 ? pendingVideos.length : 0
            approvedVideosCount = approvedVideos.length > 0 ? approvedVideos.length : 0


        }

        const info = {
            members : team.editor.length,
            approve:approvedVideosCount,
            pending:pendingVideosCount,
            total:totalVideos
        }

        return res.json(new sucResponse(true,200,"Stats Fetched Success",info))


    } catch (error) {
        next(error)
    }
}

//Helper Function Adds User To Team

async function add(username:string,teamId:string){

    const editor = await Editor.findOneAndUpdate({username},{
        isInTeam:true,
        teamId:teamId
    },{new:true}).select("+role")

    if(!editor){
        throw new errResponse("No Such user exists",400)
    }

    if(editor.role != "EDITOR"){
        throw new errResponse("Invalid Request",400)
    }

    const team : any = await Team.findByIdAndUpdate(
    teamId ,
    {  
        $addToSet: { editor : editor._id},
    },
    {new:true}) 


    if(!team){
        throw new errResponse("Something went wrong",500)
    }

    return {
        team,
        editor
    }

}

export {
    add
}