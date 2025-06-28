import express, { NextFunction, Request, urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import otpRouter from "./routes/otp.router"
import clientRouter from "./routes/client.router"
import teamRouter from "./routes/team.router"
import videoRouter from "./routes/video.router"
import ytRouter from "./routes/yt.router"
import session from "express-session"
import { google } from "googleapis"
import axios from "axios"
import editorRouter from "./routes/editor.router"
import rateLimit from "express-rate-limit"


dotenv.config()


const app = express()

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

app.use(limiter)
app.use('/api/otp'     , otpRouter)
app.use('/api/client'  , clientRouter)
app.use('/api/editor'  , editorRouter )
app.use('/api/team'    , teamRouter  )
app.use('/api/video'   , videoRouter )
app.use('/api/yt'      , ytRouter    )

app.get('/',async (req:any,res:any)=>{
  const response = await axios.get("http://localhost:9998/")
  console.log(response)   
})



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


export default app 