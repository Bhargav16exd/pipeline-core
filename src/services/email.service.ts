import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { emailEditorAddedForYoutuber, emailEditorAddedToTeam, emailEditorRemovedForYoutuber, emailEditorRemovedFromTeam, emailOnboardEditor, emailOnboardYoutuber, emailSignIn } from "../utils/email.templates";
dotenv.config();

const transporter = nodemailer.createTransport({

    service:"gmail",
    auth:{
        user:process.env.SYSTEM_EMAIL,
        pass:process.env.GOOGLE_APP_PASSWORD
    }

})



//On Boarding Email to Youtuber
export const sendOnBoardEmailYoutuber = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailOnboardYoutuber.subject,
        text:emailOnboardYoutuber.body.replace('{{username}}',user.username)
    })

}

//On Boarding Email to Editor
export const sendOnBoardEmailEditor = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailOnboardEditor.subject,
        text:emailOnboardEditor.body.replace('{{username}}',user.username)
    })

}

//Signin Alert
export const signinAlert = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailSignIn.subject,
        text:emailSignIn.body.replace('{{username}}',user.username)
    })

}

//Editor - Added in team
export const editorAddedToTeam = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorAddedToTeam.subject,
        text:emailEditorAddedToTeam.body.replace('{{username}}',user.username)
    })

}

//Editor - Removed from team
export const editorRemovedFromTeam = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorRemovedFromTeam.subject,
        text:emailEditorRemovedFromTeam.body.replace('{{username}}',user.username)
    })

}

//Youtuber - Added in team
export const youtuberAddedEditorToTeam = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorAddedForYoutuber.subject,
        text:emailEditorAddedForYoutuber.body.replace('{{username}}',user.username)
    })

}

//Youtuber - Removed from team
export const youtuberRemovedEditorFromTeam = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorRemovedForYoutuber.subject,
        text:emailEditorRemovedForYoutuber.body.replace('{{username}}',user.username)
    })

}