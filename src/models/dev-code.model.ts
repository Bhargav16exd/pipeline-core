import mongoose from "mongoose";


export interface DevCodeType extends Document {
    email:string;
    code:string;
    redeemed:boolean
}

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

export const Code = mongoose.model<DevCodeType>("Code",devCode)