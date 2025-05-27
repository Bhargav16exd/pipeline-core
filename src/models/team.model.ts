import mongoose, {Types} from "mongoose";


const teamSchema = new mongoose.Schema({

    youtuber:{
        type:Types.ObjectId,
        ref:"Client",
        required:true
    },
    editor:[{
        type:Types.ObjectId,
        ref:"Client",
        unique:true
    }],
    teamName:{
        type:String,
    },
    videoApproved:{
        type:Number,
        default:0
    },
    videoPending:{
        type:Number,
        default:0
    }
})

export const Team = mongoose.model("Team",teamSchema)