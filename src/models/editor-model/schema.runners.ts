import { CallbackWithoutResultAndOptionalError } from "mongoose";
import { editorSchema } from "./editor.model";
import bcrypt from "bcrypt";
import { hashPassword } from "../../utils/password-utils";
import { EditorModelType } from "./editor.model.types";
import { generateToken } from "../../utils/token-utils";

//Runs Before Save
editorSchema.pre("save", async function (this, next: CallbackWithoutResultAndOptionalError) {
	if (!this.isModified("password")) {
		return next();
	}

	if (this.password) {
		this.password = await hashPassword(this.password);
	}
});

//---- utility functions -----
editorSchema.methods.isPasswordValid = async function (this: EditorModelType, password: string) {
	return await bcrypt.compare(password, this.password);
};

editorSchema.methods.generateToken = async function () {
	try {
		return generateToken(this._id, this.role);
	} catch (error) {
		console.log("Error while creating token");
	}
};
