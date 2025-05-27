class errResponse extends Error {

    statusCode: number;
    err:Error
    stack?:any

    constructor(message:string,statusCode:number,err= [] as any,stack= ""as any){
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        this.err = err 

        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export default errResponse