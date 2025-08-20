import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { generateWriteSignedUrl } from "../services/upload.signurl"
import errResponse from "../utils/errResponse"
import sucResponse from "../utils/sucResponse"
import { Client } from "../models/client.model"
import getVideoMetaData from "../services/list.folder.objects"


/*
    Endpoint : /api/video/upload
    Working  : Generates a GCP signed URL returns URL
*/

export const initateUpload = async (req:any,res:any,next:any)=>{
    try {

        const { teamId , extension , title , comment , maximumVideoQuality } = req.body 
 
        if(!teamId || !extension || !title || !comment || !maximumVideoQuality){
           throw new errResponse("Please fill all details",400)
        }

        const team = await Team.findById(teamId)
        
        if(!team){
            throw new errResponse("No Team exist",400)
        }

        const client = await Client.findOne({teamId:team._id})

        const {username} : any = client

        if(!username || !client){
            throw new errResponse("No Team Lead Exist",400)
        }
        
        const video = await Video.create({
            uploadedBy:req.user._id,
            teamId,
            extension,
            title,
            comment,
            maximumVideoQuality
        })

        //Only Add Id to uniquly identify the video
        const videoName = video._id
        await video.save()

        const url = await generateWriteSignedUrl(videoName,username)

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
    Endpoint : /api/video/status
    Working  : Updates the status of Video Upload from "PENDING" -> "UPLOADED"
*/

export const updateUploadStatus = async (req:any,res:any,next:any)=>{

    try {

        const config = req.body 

        if(!config){
            throw new errResponse("Invalid Request",404)
        }
        
        const {url} = config

        if(!url){
            throw new errResponse("Internal Server Error Contact Dev Immediately",500)
        }

        const part = url.split('pipeline_oneminus/')[1].split('/')[1]

        const id = part.split('?')[0]

        if(!id){
            throw new errResponse("Internal Server Error Contact Dev Immediately",500)
        }


        const video = await Video.findByIdAndUpdate(id,{
            cloudUploadStatus:"UPLOADED"
        },{new:true}).select("+teamId")

        if(!video){
            throw new errResponse("Internal Server Error",500)
        }

        const team = await Team.findByIdAndUpdate(video.teamId,{
            $inc : { pendingVideos : 1 }
        },{new:true})

        if(!team){
            throw new errResponse("Internal Server Error",500)
        }
    
        return res.json(new sucResponse(true,204,"Status Updated Sucess"))

    } catch (error) {
        next(error)
    }

}

/* 
    Endpoint : /api/video/pending
    Working  :  Gets all Pending Videos
*/

export const getPendingVideos = async (req:any,res:any,next:any) => {

    try {

        const user = req.user 
        let team : any  = null
    
        if(user.role == "YOUTUBER"){
            team = await Team.findById(user.teamId)
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
            teamId:team._id,
            pending:true,
            approved:false,
            cloudUploadStatus:"UPLOADED"
        }).populate({
            path:'uploadedBy',
            select: 'name'
        })

        if(video.length == 0 ){
            return res.json(new sucResponse(true,204,"No Pending Videos Exist"))
        }

        
        const result = await getVideoMetaData(team.name)
        
        const videos = video.map((el) => {
            const metadata = result.find((en) => en.name === `${team.name}/${el._id.toString()}`);
            
            if (metadata) {
                return {
                    ...el.toObject(),
                    size: metadata.size
                };
            } 
        });

        if(videos.length > 0){
            return res.json(new sucResponse(true,200,"Pending Videos ",videos))
        }

    } catch (error) {
        next(error)   
    }

}

/* 
    Endpoint : /api/video/init
    Working  :  Gets all Approved Videos
*/

export const getInitiatedVideos = async (req:any,res:any,next:any) => {

    try {

        const user = req.user 
    
        const video = await Video.find({
            teamId:user.teamId,
            initiated:true,
            pending:true,
            approved:false
        }).populate({
            path:'uploadedBy',
            select: 'name'
        })

        if(video.length == 0 ){
            return res.json(new sucResponse(true,200,"No Youtube Upload Initiated Yet"))
        }
        else if(video.length > 0){
            return res.json(new sucResponse(true,200,"Youtube Upload Initiated Video Fetched",video))
        }

    } catch (error) {
        next(error)   
    }

}


//V2
// Watch a video
export const watchVideo = async (req:any,res:any,next:any)=>{
    // Get user data speed
    // Get stream quality according to the data speed
    // serve the video as per data speed
}

//V3
// Get Backedup video
export const getBackedupVideo = async (req:any,res:any,next:any)=>{

    // checking all video db and fetching the video all that are backed up 
    // listing those videos
    // giving them option to download the video

}