import { PubSub } from "@google-cloud/pubsub";
import { Client } from "../models/client.model";
import { Video } from "../models/video.model";
import errResponse from "../utils/errResponse";


const pubsub = new PubSub()
const subscriptionName :any  = process.env.subscriptionName
const subscription = pubsub.subscription(subscriptionName)

export const listenToGCP = () =>{

    subscription.on('message',async (message:any)=>{

        const data = JSON.parse(message.data)
        const info = data.name.split('/')
        const id   = info[1].split('-')[1]
        const path = info[0]

        const client = await Client.findOne({username:path})

        if(!client){
            throw new errResponse("Not Authenticated to do that",500)
        }

        const video = await Video.findOneAndUpdate({
            _id:id,
            uploader:client._id,
            videoName:info[1]
        },{
            uploaded:true
        },{new:true})
        

    })

}
