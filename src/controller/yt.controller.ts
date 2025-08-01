import axios from "axios"
import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { generateAuthorizationUrl} from "../services/auth"
import { getGoogleAuthToken } from "../services/auth.token"
import errResponse from "../utils/errResponse"
import { YtMetaData } from "../models/ytMetaData.model"
import exp from "constants"
import sucResponse from "../utils/sucResponse"
import { oauth2Client } from "../app"
import { google } from "googleapis"
import dotenv from "dotenv"
import { uploadQueue } from "../services/init.queues"


dotenv.config()

export const uploadVideoOnYoutube = async (req:any,res:any,next:any) => {

    try {

        // Get user information
        // notifi user to he is sure to upload his video on yt 
        // GAUTH screen opens
        // give permission
        // Download video from GCP 
        // Uploading on YT

        const {title , description , tags , privacyStatus , notifySubscribers, videoId , thumbnail } = req.body

        if(!title || !description || !privacyStatus || !notifySubscribers || !videoId || !thumbnail){
            throw new errResponse("Incomplete Inputs All Inputs Are Required",400)
        }

        //Fetch Data Regarding Video 
        const video = await Video.findOne({_id:videoId , cloudUploadStatus:"UPLOADED"})

        if(!video){
            throw new errResponse("Invalid Video Id",400)
        }


        //Create a YT Meta Data Entry
        const YT_META_DATA = await YtMetaData.create({
            title,
            description,
            tags,
            privacyStatus,
            notifySubscribers,
            videoId:video._id,
            youtuber:req.user._id,
            thumbnail:thumbnail
        })

        await YT_META_DATA.save()


        if(!YT_META_DATA){
            throw new errResponse("Internal Server Error",500)
        }


        //Get Authorization URL and State
        const {authorizationUrl,state} :any = await generateAuthorizationUrl()

    
        if(!authorizationUrl || !state){
            throw new errResponse("Internal Server Error",500)
        }


        req.session.state = state


        // Encrypt this 
        req.session.user  = req.user
        req.session.video = video 
        req.session.ytMetaData = YT_META_DATA

        //Redirect
        return res.json(new sucResponse(true,200,"Video Upload Initiated",authorizationUrl))

                
    } catch (error) {
        next(error)
    }

} 

export const upload = async (req:any,res:any,next:any)=>{
    try {

        const client = req.session.user 
        const video = req.session.video
        const YT_META_DATA =  req.session.ytMetaData

   
        if(!client || !video || !YT_META_DATA){
          throw new errResponse("Something is wrong",500)
        }

        const team  = await Team.findById(client.teamId)


        if(!team){
            throw new errResponse("Something is wrong",500)
        }


        const token = await getGoogleAuthToken(req,res)
        
        if(!token){
            throw new errResponse("Unauthorized",400)
        }


        // download the video and upload it on youtube
        // axios.post("http://localhost:9998/upload",{
        //     team,
        //     client,
        //     video,
        //     token,
        //     YT_META_DATA,
        //     svToken:process.env.SERVER_TO_SERVER_TOKEN
        // })

        await uploadQueue.add('video',{
            team,
            client,
            video,
            token,
            YT_META_DATA,
            svToken:process.env.SERVER_TO_SERVER_TOKEN
        })
        
        const channelId = await getChannelId(token)

        return res.redirect(`https://studio.youtube.com/channel/${channelId}/videos/`) 

        
    } catch (error) {
        //case of error send email
        next(error)
    }
}

export const status = async(req:any,res:any,next:any)=>{

    try {

        const { team, video ,YT_META_DATA } = req.body

        if(!team || !video || !YT_META_DATA){
            throw new errResponse("Internal Server Error",500)
        }


        const res1 = await Video.findByIdAndUpdate(video._id , {
            approved:true,
            pending:false
        })

        const ress = await Team.findByIdAndUpdate(team._id ,{
            $inc : {
                approvedVideos : 1,
                pendingVideos  : -1
            },
        })

        return res.json(new sucResponse(true,200,"Video Uploaded to Youtube Successfully"))
        
    } catch (error) {
        next(error)
    }

}

async function getChannelId (token:any){

    oauth2Client.setCredentials({
            access_token: token.access_token,
            refresh_token: token.refresh_token
    });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    
    const channel = await youtube.channels.list({
        //@ts-ignore
        part:"snippet,contentDetails,statistics",
        mine:true
    })

    //@ts-ignore
   const channelId = channel.data.items[0].id 

   return channelId
    
}