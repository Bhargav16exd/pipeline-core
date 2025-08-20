import { Worker } from "bullmq";
import { UploadLogs } from "../models/upload.logs";
import { socket } from "../socket/socket";
import { io } from "../app";

let worker;

function initWorker(){

    worker = new Worker('upload-status-queue', async (job) => {

        //Get Job Id
        //Update Status associated with ID Each Time
        //Push to socket room 
        
        const id = job.data.id
        const jobData = job.data

        await UploadLogs.findOneAndUpdate({videoId:id},{
            authorizationInitiated: jobData.authorizationInitiated.status,
            permissionGranted: jobData.permissionGranted.status,
            queue: jobData.queue.status,
            downloading: jobData.downloading.status,
            uploading: jobData.uploading.status
        })

        io.to(id).emit("status",jobData)
    },
    { concurrency: 1 , 
        connection:{
            host:"localhost"
    } },
    );
    
    worker.on("error",(error)=>{
        console.log("[ Bull MQ & Redis Connection ] : FAILED " , error)
        process.exit(1)
    })

}



export default initWorker
