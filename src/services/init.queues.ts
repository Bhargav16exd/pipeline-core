import { Queue } from "bullmq"
import IORedis from 'ioredis';

let uploadQueue : Queue ;

async function initQueues(){

    uploadQueue = new Queue('yt-upload-queue');

    //Set Global Concurrecny
    await uploadQueue.setGlobalConcurrency(3)

    const connection = new IORedis();
 
    connection.on("ready",()=>{
        console.log("[ Bull MQ & Redis Connection ] : SUCCESS ")
        console.log("[ QUEUE CREATED ]",uploadQueue.name)
    })

    connection.on("error",(error)=>{
        console.log("[ Bull MQ & Redis Connection ] : FAILED ", error )
        throw error
    })


    setInterval(async ()=>{
        console.log(await uploadQueue.getJobCounts())
    },10000)

}


export default initQueues

export {
    uploadQueue
}
