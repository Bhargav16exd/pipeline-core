import { Storage } from "@google-cloud/storage";

/*
  Function generate a signed url for uploading a file to the GCP bucket
*/
export const generateWriteSignedUrl = async (user:any,contentType:any,fileName:any) =>{

    try {

      const bucketName : any  = process.env.BUCKET_NAME;
  
      const options : any = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 60 * 60 * 1000, 
        contentType: contentType,
      };
    
      const storage = new Storage()

      const [url]:any  = await storage
        .bucket(bucketName)
        .file(`${user.username}/${fileName}`)
        .getSignedUrl(options);

      
      return url
    
    } catch (error) {
      console.log(error)
      return false
    }
}