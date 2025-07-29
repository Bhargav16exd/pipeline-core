import { Queue } from "bullmq"
import IORedis from 'ioredis';

async function initQueues(){

    const myQueue = new Queue('myqueue');
    const connection = new IORedis();
    
    connection.on("ready",()=>{
        console.log("Bull MQ attached Redis : SUCCESS ")
    })

    connection.on("error",(error)=>{
        console.log("Bull MQ attached Redis : FAILED ",error)
    })
}


export {
    initQueues
}