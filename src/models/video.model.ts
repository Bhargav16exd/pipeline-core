import mongoose, { Types } from "mongoose";

const videoSchema = new mongoose.Schema({

    uploader:{
        type:Types.ObjectId,
        ref:"Client"
    },
    team:{
        type:Types.ObjectId,
        ref:"Team"
    },
    approved:{
        type:Boolean,
        default:false,
    },
    pending:{
        type:Boolean,
        default:true
    },
    videoName:{
        type:String,
    },
    contentType:{
        type:String,
        required:true
    },
    uploaded:{
        type:Boolean,
        default:false
    },
    extension:{
        type:String,
        required:true
    }

},
{
    timestamps:true
});

export const Video = mongoose.model("Video",videoSchema)

