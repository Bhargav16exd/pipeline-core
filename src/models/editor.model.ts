import mongoose , {Document, Types} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export interface EditorType extends Document {
    name:string,
    username: string;
    email: string;
    about:string,
    yearsOfExperience:number,
    profile:string,
    isInTeam:boolean,
    password: string;
    role: "ADMIN" | "YOUTUBER" | "EDITOR";
    teamId : any          
    isPasswordValid(password: string): Promise<boolean>;
    generateToken():Promise<string>
}

const editorSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true,
        required:true 
    },
    email:{
        type:String,
        required:true 
    },
    profile:{
        type:String,
        required:true
    },
    role:{
        type: String,
        default: "EDITOR",
        required:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    isInTeam:{
        type:Boolean
    },
    teamId:{
        type:Types.ObjectId,
        ref:"Team"
    }

},{
    timestamps:true
})



editorSchema.pre('save',async function (next){

        const client = this as any 
      
        if(!client.isModified('password')){
            return next()
        }
    
        if (client.password) {
          
            this.password = await bcrypt.hash(this.password, 10);
        }
})


editorSchema.methods.isPasswordValid = async function(password:string){
       const client = this as any
       return await bcrypt.compare(password,this.password)
}

editorSchema.methods.generateToken = async function () {

   try {
     const key =  process.env.JWT_SECRET as any
 
     const token = jwt.sign(
     {_id  : this._id,
      role : this.role 
     },
     key,
     {
        expiresIn:'7d'
     }) 
     return token

   } catch (error) {
      console.log("Error while creating token")
   }

}


export const Editor = mongoose.model<EditorType>("Editor",editorSchema)
