import { Console } from "console"
import { Client } from "../models/client.model"
import dotenv from "dotenv"

dotenv.config()

async function initAdmin(){

    const account = await Client.findOne({username:process.env.ADMIN_USERNAME})

    if(!account){ 
        const admin = {
            username:process.env.ADMIN_USERNAME ,
            email:process.env.ADMIN_EMAIL ,
            role:"YOUTUBER",
            password:process.env.ADMIN_PASSWORD,
            isInTeam:false,
            subscriptionPlan:"DEV_CODE"
        }
        await Client.create({...admin})
    }
}

export {
    initAdmin
}