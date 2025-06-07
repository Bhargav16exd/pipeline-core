import { Mongoose } from "mongoose"
import { Team } from "../models/team.model"
import errResponse from "../utils/errResponse"

/*
    Working Class : Helper Function
    Working  : Creates an Team when a new youtuber signup
*/

export const createTeam = async (client:any) => {

    try {

        const team = await Team.create({
            name:client.username,
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



