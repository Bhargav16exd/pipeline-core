import app, { socketApp } from "./app"
import { connectToDatabase } from "./db/db"
import dotenv from "dotenv"
import { exit } from "process"
import { startupSetup } from "./services/startup.setup"


dotenv.config()

const PORT = process.env.PORT;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT;

connectToDatabase()
.then(()=>{

  socketApp.listen(WEBSOCKET_PORT, ()=>{
    console.log(`Socket Server is up and Running on PORT : ${WEBSOCKET_PORT}`)
  })

  app.listen(PORT,()=>{
    console.log(`Server is up and running on PORT : ${PORT}`)
  })

  //Perform Setup
  startupSetup()

})
.catch((err)=>{
    console.log(`Some unexpected error has occured while connecting to DB : ${err}`)
    exit(1)
})

