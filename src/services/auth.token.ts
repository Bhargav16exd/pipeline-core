import { oauth2Client } from "../app";

export const getGoogleAuthToken = async(req:any,res:any)=>{

  try {

    let q = req.query

    if (q.error) { 
      console.log('Error:' + q.error);
    } else if (q.state != req.session.state) { 
      console.log('State mismatch. Possible CSRF attack');
      res.end('State mismatch. Possible CSRF attack');
    } else { 
      let  {tokens}  : any = await oauth2Client.getToken(q.code);
      oauth2Client.setCredentials(tokens);
      return tokens
    }

  } catch (error) {
      console.log(error)
  }
}