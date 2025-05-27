import { upload } from "@google-cloud/storage/build/cjs/src/resumable-upload"
import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { generateWriteSignedUrl } from "../services/upload.signurl"
import errResponse from "../utils/errResponse"
import sucResponse from "../utils/sucResponse"



// Video to be transcoded after uploading to the GCP 
export const initateUpload = async (req:any,res:any,next:any)=>{
    try {

        const {contentType , name, teamId} = req.body 
        
        if(!contentType || !name || !teamId){
           throw new errResponse("Please fill all details",400)
        }

        const team = await Team.findById(teamId)
        
        if(!team){
            throw new errResponse("No Team exist",400)
        }
        
        const video = await Video.create({
            uploader:req.user._id,
            contentType,
            team:teamId
        })

        //Only Add Id to uniquly identify the video

        const videoName = name + "-" + `${video._id}`
        video.videoName = videoName
        await video.save()

        const url = await generateWriteSignedUrl(req.user,contentType,videoName)

        if(!url){
            throw new errResponse("Something went wrong",500)
        }

        // transcode() do something that will transcode the video into 4k 2k 1080p
        
        return res.json(new sucResponse(true,200,"Video Upload Initiated",url))
        
    } catch (error) {
        next(error)
    }
}

/* 
Function Fetches pending video that are waiting for the approval of the Youtuber for upload 
*/

export const getPendingVideos = async (req:any,res:any,next:any) => {

    try {
        const user = req.user 
        let team  = null
    
        if(user.role == "YOUTUBER"){
            team = await Team.findOne({
                youtuber:user._id
            })
        }
        else if(user.role=="EDITOR"){
            team = await Team.findOne({
                editor:{
                    $elemMatch :{ $eq:user._id}
                }
            
            })
        }
    
        if(!team){
            throw new errResponse("No Team Exist",400)
        }
    
        const video = await Video.find({
            team:team._id,
            pending:true,
            approved:false
        })
    
        if(video.length == 0 ){
            return res.json(new sucResponse(true,200,"No Pending Videos Exist"))
        }
        else if(video.length > 0){
            return res.json(new sucResponse(true,200,"Pending Videos ",video))
        }
    } catch (error) {
        next(error)   
    }

}

/* 
    Function Fetches videos that are approved by the Youtuber
*/

export const getApprovedVideos = async (req:any,res:any,next:any) => {

    try {
        const user = req.user 
        let team  = null
    
        if(user.role == "YOUTUBER"){
            team = await Team.findOne({
                youtuber:user._id
            })
        }
        else if(user.role=="EDITOR"){
            team = await Team.findOne({
                editor:{
                    $elemMatch :{ $eq:user._id}
                }
            
            })
        }
    
        if(!team){
            throw new errResponse("No Team Exist",400)
        }
    
        const video = await Video.find({
            team:team._id,
            pending:false,
            approved:true
        })
    
        if(video.length == 0 ){
            return res.json(new sucResponse(true,200,"No Approved Videos Exist"))
        }
        else if(video.length > 0){
            return res.json(new sucResponse(true,200,"Approved Videos ",video))
        }
    } catch (error) {
        next(error)   
    }

}


// Watch a video
export const watchVideo = async (req:any,res:any,next:any)=>{
    // Get user data speed
    // Get stream quality according to the data speed
    // serve the video as per data speed
}

// Get Backedup video
export const getBackedupVideo = async (req:any,res:any,next:any)=>{

    // checking all video db and fetching the video all that are backed up 
    // listing those videos
    // giving them option to download the video

}