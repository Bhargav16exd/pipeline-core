import {StorageControlClient} from "@google-cloud/storage-control"


export default async function createFolderGCP (name:string){

    try {
       
        const bucketName : any  = process.env.BUCKET_NAME;
        const folderName = name;
       
         const controlClient = new StorageControlClient();
       
         const bucketPath = controlClient.bucketPath('_', bucketName);
       
         const request = {
           parent: bucketPath,
           folderId: folderName,
         };
       
         const [response] = await controlClient.createFolder(request);

         return response

     } catch (error) {
        console.log(error)
        return false
     }
    
}

