import { Storage } from "@google-cloud/storage";

export default async function getVideoMetaData(folderName:any){

    const storage = new Storage();

    const prefix = `${folderName}/`

    const bucketName : any  = process.env.BUCKET_NAME;

    const options = {
        prefix:prefix
    }

    const [files] = await storage.bucket(bucketName).getFiles(options);


    let sizes = [];

    sizes = files.map((file)=>{
        return {
            name:file.metadata.name,
            size:file.metadata.size
        }
    })

   return sizes
}