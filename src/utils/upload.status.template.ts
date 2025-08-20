export const PENDING = "PENDING"
export const INPROGRESS = "INPROGRESS"
export const DONE = "DONE"


// Factory function to create a fresh status object
export const createVideoStatus = (id : any ,authorizationInitiated:string,permissionGranted:string,queue:string,downloading:string,uploading:string) => {
  return {
    id,
    authorizationInitiated: {
      status: authorizationInitiated
    },
    permissionGranted: {
      status: permissionGranted
    },
    queue: {
      status: queue
    },
    downloading: {
      status: downloading
    },
    uploading: {
      status: uploading
    }
  };
};

