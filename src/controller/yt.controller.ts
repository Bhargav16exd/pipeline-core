import axios from "axios"
import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { generateAuthorizationUrl} from "../services/auth"
import { getGoogleAuthToken } from "../services/auth.token"
import errResponse from "../utils/errResponse"
import { YtMetaData } from "../models/ytMetaData.model"

export const uploadVideoOnYoutube = async (req:any,res:any,next:any) => {

    try {

        // Get user information
        // notifi user to he is sure to upload his video on yt 
        // GAUTH screen opens
        // give permission
        // Download video from GCP 
        // Uploading on YT

        const {title , description , tags , privacyStatus , notifySubscribers, videoId} = req.body

        if(!title || !description || !privacyStatus || !notifySubscribers || !videoId){
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
            youtuber:req.user._id
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
        res.redirect(authorizationUrl);
        
        console.log(authorizationUrl)
        
    } catch (error) {
        next(error)
    }

} 

export const upload = async (req:any,res:any,next:any)=>{
    try {

        const client = req.session.user 
        const video = req.session.video
        const YT_META_DATA =  req.session.ytMetaData

        console.log(req.session)

   
        if(!client || !video || !YT_META_DATA){
          throw new errResponse("Something is wrong",500)
        }

        const team  = await Team.findOne({
            editor:{
                $elemMatch:{$eq:video.uploadedBy}
            }
        })

        if(!team){
            throw new errResponse("Something is wrong",500)
        }


        const token = await getGoogleAuthToken(req,res)
        
        if(!token){
            throw new errResponse("Unauthorized",400)
        }

        console.log(token)

        // spwan some container pass video data and token to it 
        // download the video and upload it on youtube

        //PUSH the data to the QUEUE
        await axios.post("http://localhost:9998/upload",{
            team,
            client,
            video,
            token,
            YT_META_DATA
        })

        
        // const data = {
        //     team,
        //     client,
        //     video,
        //     token
        // }

        // await publishMessage(data)


        // res.redirect("https://www.youtube.com/")
        
    } catch (error) {
        next(error)
    }
}



