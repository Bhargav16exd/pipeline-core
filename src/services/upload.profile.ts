import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"

//@ts-ignore
const s3 :any = new S3Client ({
    region: process.env.AWS_REGION,
    //@ts-ignore
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})


export const uploadImageToAwsS3 = async (file:any)=>{
    try {

        const fileContent = fs.readFileSync(`${file.destination}/${file.originalname}`)

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: file.originalname,
            Body: fileContent,
          };

          const command = new PutObjectCommand(params);
          await s3.send(command);

          const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.originalname}`;

           
          fs.unlinkSync(`${file.destination}/${file.originalname}`)

          return url
        
    } catch (error) {
        console.log(error)
    }
}