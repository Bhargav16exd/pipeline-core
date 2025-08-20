import app, { socketApp } from "./app"
import { connectToDatabase } from "./db/db"
import dotenv from "dotenv"
import { listenToGCP } from "./services/pubsub"
import  initQueues  from "./services/init.queues"
import { exit } from "process"
import initWorker from "./services/upload.status.worker"
import ListenToSocket from "./socket/socket"


dotenv.config()

const PORT = process.env.PORT 

connectToDatabase()
.then(()=>{

    socketApp.listen(9001,()=>{
        console.log(`Socket Server is up and Running on PORT : ${9001}`)
    })

    app.listen(PORT,()=>{
        console.log(`Server is up and running on PORT : ${PORT}`)
    })

    //Initialize Queue
    initQueues()
    initWorker()
    ListenToSocket()
    // listenToGCP()
})
.catch((err)=>{
    console.log(`Some unexpected error has occured while connecting to DB : ${err}`)
    exit(1)
})

