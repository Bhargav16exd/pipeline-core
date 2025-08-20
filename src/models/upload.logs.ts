import mongoose, { Types } from "mongoose";

const uploadLogSchema = new mongoose.Schema({

    videoId:{
        type:Types.ObjectId,
        ref:"Video",
        unique:true
    },
    authorizationInitiated:{
        type:String,
        default:"DONE",
        enum: ["PENDING","INPROGRESS","DONE"]
    },
    permissionGranted:{
        type:String,
        default:"PENDING",
        enum: ["PENDING","INPROGRESS","DONE"]
    },
    queue:{
        type:String,
        default:"PENDING",
        enum: ["PENDING","INPROGRESS","DONE"]
    },
    downloading:{
        type:String,
        default:"PENDING",
        enum: ["PENDING","INPROGRESS","DONE"]
    },
    uploading:{
        type:String,
        default:"PENDING",
        enum: ["PENDING","INPROGRESS","DONE"]
    }

},{
    timestamps:true
})

export const UploadLogs = mongoose.model("UploadLogs",uploadLogSchema)
