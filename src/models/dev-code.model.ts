import mongoose from "mongoose";

const devCode = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    code:{
        type:String,
        required:true,
        unique:true
    },
    redeemed:{
        type:Boolean,
        default:false,
    }

})

export const Code = mongoose.model("Code",devCode)