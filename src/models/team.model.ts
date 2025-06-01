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
        ref:"Client",
        unique:true,
        required:false
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
    }

})

export const Team = mongoose.model("Team",teamSchema)