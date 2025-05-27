class sucResponse {

    success: boolean;
    statusCode: number;
    message :string;
    data?: object

    constructor(success:boolean,statusCode:number,message:string,data?:object){

        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data

    }

}

export default sucResponse