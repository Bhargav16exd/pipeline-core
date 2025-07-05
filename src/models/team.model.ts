import mongoose, {Types} from "mongoose";

/*
    Title : Defines Mongoose Schema for Team
    Need  : Used to Define Data of Team 
*/


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

export const Team = mongoose.model("Team",teamSchema)