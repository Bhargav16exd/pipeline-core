import mongoose, { Types } from "mongoose";


/*
    Title : Defines Mongoose Schema Video to be Uploaded on YT
    Need  : Used to Defines Meta Data of Video that are being uploaded to YT 
            such as title , description , public / private , adult or not
*/

const ytMetaDataSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        require:true
    },
    tags:[{
        type:String,
    }],
    privacyStatus:{
        type:String,
        enum:['public','private','unlisted'],
        default:'private',
        required:true
    },
    notifySubscribers:{
        type:Boolean,
        required:true,
        default:true
    },
    youtuber:{
        type:Types.ObjectId,
        ref:"Client",
        required:true
    },
    videoId : {
        type:Types.ObjectId,
        ref:"Video",
        required:true
    },

},
{
    timestamps:true
})

export const YtMetaData = mongoose.model("YtMetaData",ytMetaDataSchema)

