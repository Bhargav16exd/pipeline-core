import { Response } from "express";

class errResponse extends Error {
	statusCode: number;
	err: Error;
	stack?: any;

	constructor(message: string, statusCode: number, err = [] as any, stack = "" as any) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.err = err;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

const emptyInputValidatorHanlder = (fields: Record<string, string>, res: Response) => {
	Object.keys(fields).forEach((key) => {
		fields[key].trim();
		if (fields[key].trim() == undefined || fields[key].trim() == "") {
			throw new errResponse("Incomplete Inputs.", 400);
		}
	});
};

export default errResponse;
export { emptyInputValidatorHanlder };
