import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"
import crypto from "crypto"
import dotenv from "dotenv"

dotenv.config()

/*
    Working Class : Helper Function
    Working  : Creates an Team when a new youtuber signup
*/

export const createTeam = async (client:any) => {

    try {

        const inviteCode = generateInviteCode(client._id)

        if(!inviteCode){
            throw new errResponse('Internal Server Error',500)
        }

        const team = await Team.create({
            name:client.username,
            inviteCode
        })

        if(!team){
            throw new errResponse("Something went wrong ",500)
        }

        await team.save()
        return team
        
    } catch (error) {
        console.log(error)        
    }

}

//Generate Invite Code
function generateInviteCode(input:string){

    const payload = `${input}+/${process.env.SALT}+/${process.env.COUPON_SECRET}`
    const hash = crypto.createHash("sha256")
    const code = hash.update(payload).digest('hex')
    return code

}



