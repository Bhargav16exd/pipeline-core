import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"


export const createTeam = async (client:any) => {

    try {

        const team = await Team.create({
            youtuber:client._id,
            teamName:client.username   
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



