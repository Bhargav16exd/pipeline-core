import axios from "axios"
import { Client } from "../models/client.model"
import { Team } from "../models/team.model"
import { Video } from "../models/video.model"
import { generateAuthorizationUrl} from "../services/auth"
import { getGoogleAuthToken } from "../services/auth.token"
import errResponse from "../utils/errResponse"
import { oauth2Client } from "../app"


export const uploadVideoOnYoutube = async (req:any,res:any,next:any) => {

    try {

        // Get user information
        // notifi user to he is sure to upload his video on yt 
        // GAUTH screen opens
        // give permission
        // Download video from GCP 
        // Uploading on YT

        const {id,videoId} = req.params

        const user = await Client.findById(id)
        const video = await Video.findById(videoId)

        //const user = req.user

        const {authorizationUrl,state} :any = await generateAuthorizationUrl()

        req.session.state = state

        // Encrypt this 
        req.session.user  = user
        req.session.video = video 

        console.log(req.session)

        console.log(authorizationUrl)

        res.redirect(authorizationUrl);
        
        
    } catch (error) {
        next(error)
    }

} 

export const upload = async (req:any,res:any,next:any)=>{
    try {

        const client = req.session.user 
        const video = req.session.video

        console.log(req.session)

   
        if(!client || !video){
          throw new errResponse("Something is wrong",500)
        }

        const team  = await Team.findOne({
            youtuber:client._id,
            editor:{
                $elemMatch:{$eq:video.uploader}
            }
        })

        console.log(team)

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
            token
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

import {PubSub} from '@google-cloud/pubsub';

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

async function publishMessage(data:any) {

    //@ts-ignore
    const dataBuffer = Buffer.from(JSON.stringify(data));

   console.log(dataBuffer)

  const topic = pubSubClient.topic('projects/ultimate-task-437523-b9/topics/service-queue');

  try {
    const messageId =  await topic.publishMessage({data: dataBuffer});
    console.log(`Message ${messageId} published.`);
  } catch (error) {
    console.error(
      `Received error while publishing: ${(error as Error).message}`
    );
    process.exitCode = 1;
  }
}