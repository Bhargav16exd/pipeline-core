import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({

    service:"gmail",
    auth:{
        user:process.env.SYSTEM_EMAIL,
        pass:process.env.GOOGLE_APP_PASSWORD
    }

})


export const sendMail = async (user:any) =>{

    transporter.sendMail({
        from:process.env.SYSTEM_EMAIL,
        to:user.email,
        text:"test alert"
    })

}