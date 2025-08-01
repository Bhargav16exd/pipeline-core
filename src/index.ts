import app from "./app"
import { connectToDatabase } from "./db/db"
import dotenv from "dotenv"
import { listenToGCP } from "./services/pubsub"
import  initQueues  from "./services/init.queues"
import { exit } from "process"


dotenv.config()

const PORT = process.env.PORT 

connectToDatabase()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is up and running on PORT : ${PORT}`)
    })

    //Initialize Queue
    initQueues()
    // listenToGCP()
})
.catch((err)=>{
    console.log(`Some unexpected error has occured while connecting to DB : ${err}`)
    exit(1)
})

