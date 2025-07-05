import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"



async function VerifyInviteCode(req:any,res:any,next:any){

    try {

        //Get Invite Code
        const {inviteCode} = req.body
    
        //Check if its null
        if(!inviteCode){
            throw new errResponse("Invalid Inputs",400)
        }
    
        //Find team associated with Invite Code
        const team = await Team.findOne({
            inviteCode
        })
    
        //If no team exist Invalid Invite Code
        if(!team){
            throw new errResponse("Invalid Invite Code",500)
        }

        req.team = team;
        next();

    } catch (error) {
        next(error)
    }

}

export {
    VerifyInviteCode
}