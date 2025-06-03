import { Storage } from "@google-cloud/storage";

/*
  Function generate a signed url for uploading a file to the GCP bucket
*/
export const generateWriteSignedUrl = async (fileName:any,username:string) =>{

    //file is uploaded to own folder of editor not team leads folder fix this 

    try {

      const bucketName : any  = process.env.BUCKET_NAME;
  
      const options : any = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 60 * 60 * 1000
      };
    
      const storage = new Storage()

      const [url]:any  = await storage
        .bucket(bucketName)
        .file(`${username}/${fileName}`)
        .getSignedUrl(options);

      return url
    
    } catch (error) {
      console.log(error)
      return false
    }
}