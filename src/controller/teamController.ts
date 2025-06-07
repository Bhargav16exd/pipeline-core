import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"
import sucResponse from "../utils/sucResponse"




export const info = async (req:any,res:any,next:any)=>{
    
    try {
        
        const { teamId } = req.params

        if(!teamId){
            throw new errResponse("Invalid Inputs",400)
        }

        const team = await Team.findById(teamId).populate('editor')

        if(!team){
            throw new errResponse("Invalid Team Id" , 400)
        }

        return res.json(new sucResponse(true,200,"Team Fetched Success",team))
        

    } catch (error) {
        next(error)
    }
}