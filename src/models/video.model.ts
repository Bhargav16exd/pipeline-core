import mongoose, { Types } from "mongoose";

/*
    Title : Defines Mongoose Schema for Video
    Need  : Used to Define Data of Video that are being uploaded to Cloud Provider
*/

const videoSchema = new mongoose.Schema({
    
    teamId:{
        type:Types.ObjectId,
        ref:"Team"
    },
    uploadedBy:{
        type:Types.ObjectId,
        ref:"Editor"
    },
    cloudUploadStatus:{
        type: String,
        enum: ['PENDING','UPLOADED'],
        default: 'PENDING',
        required:true
    },
    extension:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    maximumVideoQuality:{
        type:String,
        required:true
    },
    approved:{
        type:Boolean,
        default:false,
    },
    pending:{
        type:Boolean,
        default:true
    },
    initiated:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});

export const Video = mongoose.model("Video",videoSchema)

