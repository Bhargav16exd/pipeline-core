import mongoose, {Document, ObjectId, Types} from "mongoose";

/*
    Title : Defines Mongoose Schema for Team
    Need  : Used to Define Data of Team 
*/

export interface TeamType extends Document {
    name:string;
    editor:Types.ObjectId[],
    approvedVideos:number;
    pendingVideos:number;
    inviteCode:string
}


const teamSchema = new mongoose.Schema({

    name:{
        type : String,
        required:true
    },
    editor:[{
        type:Types.ObjectId,
        ref:"Editor",
    }],
    approvedVideos:{
        type:Number,
        default:0,
        required:true
    },
    pendingVideos:{
        type:Number,
        default:0,
        required:true
    },
    inviteCode:{
        type:String,
        required:true,
        unique:true
    }

})

export const Team = mongoose.model<TeamType>("Team",teamSchema)