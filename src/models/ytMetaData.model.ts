import mongoose, { Types } from "mongoose";


/*
    Title : Defines Mongoose Schema Video to be Uploaded on YT
    Need  : Used to Defines Meta Data of Video that are being uploaded to YT 
            such as title , description , public / private , adult or not
*/

const ytMetaDataSchema = new mongoose.Schema({

    videoId : {
        type:Types.ObjectId,
        ref:"Video"
    }

},
{
    timestamps:true
})

export const YtMetaData = mongoose.model("YtMetaData",ytMetaDataSchema)

