import { Client } from "../models/client.model"
import { Editor } from "../models/editor.model"
import createFolderGCP from "../services/create.folder.gcp"
import { createTeam } from "../services/create.team.service"
import { passwordChangeAlert, sendOnBoardEmailYoutuber, signinAlert } from "../services/email.service"
import errResponse from "../utils/errResponse"
import sucResponse from "../utils/sucResponse"



/*
    Endpoint : /api/client/signup
    Working  : Creates Account of User
    Working Class : API Controller
*/

export const signup = async (req:any,res:any,next:any) => {

   try {
    
    const { username , email , password , role } = req.body
 
    if(!username || !email || !password || !role){
       throw new errResponse("Kindly Provide all arguments" , 400 )
    }
 
    const clientExist = await Client.findOne({username:username})
 
    if(clientExist){
         throw new errResponse("Username already exists",400)
    }

    if(role == "ADMIN"){
         throw new errResponse("Unauthorized Operation",400)
    }

    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/;

    if(!regex.test(password)){
        throw new errResponse("Password must be 8-20 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and no spaces.",400)
    }
 
    const client = await Client.create({
        username,
        password,
        email,
        role,
        isInTeam:false
    })


    /*
        If the user is an Youtube Init the Team and Cloud Storage
    */

    if(client.role == "YOUTUBER"){

       const team = await createTeam(client)

       if(!team){
        await Client.deleteOne({_id:client._id})
        throw new errResponse("Something went wrong",500)
       }

        client.teamId = team._id 
        
        const response = await createFolderGCP(username)

        if(!response){
            await Client.deleteOne({_id:client._id})
            throw new errResponse("Something went wrong",500)
        }

    }

 
    await sendOnBoardEmailYoutuber(client)

    await client.save()
    return res.json(new sucResponse(true,200,"Account Created Successfully"))

   } catch (error) { 
      next(error)
   }
}


/*
    Endpoint : /api/client/signin
    Working  : Logins User
*/

export const signin = async(req:any,res:any,next:any)=>{

    try {
        
        const { username, password:inputPassword } = req.body 
        
        if(!username || !inputPassword){
            throw new errResponse("Please Provide all fields",400)
        }

        let client : any = await Client.findOne({username}).select("+password +role")

        if(!client){
            client = await Editor.findOne({username}).select("+password +role")
        }

        if(!client){
            throw new errResponse("User doesnt exist",400)
        }

     
        const isMatch = await client.isPasswordValid(inputPassword)

        if(!isMatch){
            throw new errResponse("Incorrect Password",400)
        }

        const token = await client.generateToken()

        const options = {
            sameSite:"None",
            secure:true ,
            httpOnly:true ,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
        
        const response : any = {
            username:client.username,
            email:client.email,
            role:client.role,
            teamId:client.teamId,
            isInTeam:client.isInTeam
        }


        await signinAlert(client)

        return res
        .cookie("token",token,options)
        .json(new sucResponse(true,200,"Login Success",{token,response}))


    } catch (error) {
        next(error)
    }

}

/*
    Endpoint : /api/client/logout
    Working  : Logout User
*/

export const logout = async(req:any,res:any,next:any)=>{

    try {
        res.clearCookie("token").json(new sucResponse(true,200,"Logout successfully"))
    } catch (error) {
        next(error)
    }

}

export const IAM = async(req:any,res:any,next:any)=>{

     try {
        const client = req.user
        return res.json(new sucResponse(true,200,"User fetched Sucess",client))

     } catch (error) {
        next(error)
     }

}


/*
    Endpoint : /api/client/logout
    Working  : Change Password 
*/


export const changePassword = async (req:any,res:any,next:any) => {
    try {
        
        const { oldPassword , newPassword } = req.body

        if( !oldPassword || !oldPassword.trim() || !newPassword || !newPassword.trim() ){
            throw new errResponse("Incomplete Inputs", 400)
        }

        const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,20}$/;

        if(!regex.test(newPassword)){
            throw new errResponse("Password must be 8-20 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and no spaces.",400)
        }

        const youtuber = await Client.findById(req.user._id).select("+password")

        if(!youtuber){
            throw new errResponse("No User Found",400)
        }

        const isMatch = await youtuber.isPasswordValid(oldPassword)

        if(!isMatch){
            throw new errResponse("Incorrect Password",400)
        }

        youtuber.password = newPassword
        await youtuber.save()


        await passwordChangeAlert(youtuber)

        return res.json(new sucResponse(true , 201 , "Password Change Successfully"))

    } catch (error) {

        next(error)
    }
}