import nodemailer from "nodemailer"
import dotenv from "dotenv";
import { emailEditorAddedForYoutuber, emailEditorAddedToTeam, emailEditorRemovedForYoutuber, emailEditorRemovedFromTeam, emailOnboardEditor, emailOnboardYoutuber, emailPasswordChange, emailSignIn, otpVerificationMail } from "../utils/email.templates";
dotenv.config();

//Mail Transporter
const transporter = nodemailer.createTransport({

    service:"gmail",
    auth:{
        user:process.env.SYSTEM_EMAIL,
        pass:process.env.GOOGLE_APP_PASSWORD
    }

})

// Mail verification service to user
export async function sendOtpEmail(email: any, otp: string) {

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: otpVerificationMail.subject,
    text: otpVerificationMail.body.replace('{{username}}',email).replace('{{otp}}', otp)
  };
  
  await transporter.sendMail(mailOptions);
}


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
export const alertEditor_editorAddedToTeam = async (user:any,team:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorAddedToTeam.subject,
        text:emailEditorAddedToTeam.body
            .replace('{{username}}',user.username)
            .replace('{{teamName}}',team.name)
    })

}

//Editor - Removed from team
export const alertEditor_editorRemovedFromTeam = async (user:any,team:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorRemovedFromTeam.subject,
        text:emailEditorRemovedFromTeam.body
            .replace('{{username}}',user.username)
            .replace('{{teamName}}',team.name)
    })

}

//Youtuber - Added in team
export const alertYoutuber_AddedEditorToTeam = async (user:any,editor:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorAddedForYoutuber.subject,
        text:emailEditorAddedForYoutuber.body
            .replace('{{username}}',user.username)
            .replace('{{editorName}}',editor.name)
    })

}

//Youtuber - Removed from team
export const alertYoutuber_RemovedEditorFromTeam = async (user:any,editor:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailEditorRemovedForYoutuber.subject,
        text:emailEditorRemovedForYoutuber.body
            .replace('{{username}}',user.username)
            .replace('{{editorName}}',editor.name)
    })

}

//Forget Password Alert
export const passwordChangeAlert = async (user:any)=>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        subject:emailPasswordChange.subject,
        text:emailPasswordChange.body.replace('{{username}}',user.username)
    })

}