//Package Imports
import express, { NextFunction, Request, urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import { google } from "googleapis"
import session from "express-session"
import rateLimit from "express-rate-limit"

//Infile Imports
import otpRouter from "./routes/otp.router"
import clientRouter from "./routes/client.router"
import teamRouter from "./routes/team.router"
import videoRouter from "./routes/video.router"
import ytRouter from "./routes/yt.router"
import editorRouter from "./routes/editor.router"
import adminRouter from "./routes/admin.router"
import { createServer } from "http"
import { Server } from "socket.io"
import { latest } from "./socket/socket"



dotenv.config()


const app = express()

const socketApp = createServer(app)
const io = new Server(socketApp,{
  cors:{
    origin:process.env.ORIGIN_URL,
    credentials:true
  }
})



app.use(cookieParser())
app.use(urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
  credentials:true,
  origin:process.env.ORIGIN_URL
}))
app.use(session({
  secret: 'your_secure_secret_key',
  resave: false,
  saveUninitialized: false,
}));

export const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

//Rate Limiter
const limiter = rateLimit({
  windowMs:1000*60*5,
  max:1000
})

//Rate Limiter Middleware
app.use(limiter)

app.use('/api/otp'     , otpRouter)
app.use('/api/client'  , clientRouter )
app.use('/api/editor'  , editorRouter )
app.use('/api/team'    , teamRouter  )
app.use('/api/video'   , videoRouter )
app.use('/api/yt'      , ytRouter    )
app.use('/api/admin'   , adminRouter )

app.get('/logs/:id',latest)



// Error Handler
app.use((err:any,req:Request ,res: any ,next:NextFunction)=>{

  const statusCode = err.statusCode || 500 
  const message    = err.message    || "Something went wrong"
  const error      = err            

  return res.status(statusCode).json({
    statusCode,
    message,
    error
  })
  
})

export {
  io,
  socketApp
}

export default app 