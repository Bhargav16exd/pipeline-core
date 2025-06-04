import { google } from "googleapis";
import crypto from "crypto"
import { oauth2Client } from "../app";


/*
    Work : Authorization 

    Working Explanation :
    This function generates the authorization URL for the user EVERY TIME
    to grant permission to the application to upload videos on their behalf.

    Technicality Explanation : Uses GOOGLE OAUTH2 , defines scopes of permission and returns Redirect URL 
    redirecting user to Google's Permission Screen.
    
*/

 

export const generateAuthorizationUrl = async () =>{
    try {

        const scopes : any = [ `${process.env.YOUTUBE_UPLOAD_SCOPE}` ];
        
        const state = crypto.randomBytes(32).toString('hex');
        
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            state:state
        });

        return {authorizationUrl,state}
        
    } catch (error) {
        console.log(error)
    }
}