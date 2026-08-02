import { youtuberSchema } from "./youtuber.model";
import bcrypt from "bcrypt";
import { CallbackWithoutResultAndOptionalError } from "mongoose";
import { YoutuberModelType } from "./youtuber.model.types";
import { hashPassword } from "../../utils/password-utils";
import { generateToken } from "../../utils/token-utils";

//Runs Before Save
youtuberSchema.pre("save", async function (this, next: CallbackWithoutResultAndOptionalError) {
	if (!this.isModified("password")) {
		return next();
	}

	if (this.password) {
		this.password = await hashPassword(this.password);
	}
});

//---- utility functions -----
youtuberSchema.methods.isPasswordValid = async function (
	this: YoutuberModelType,
	password: string
) {
	return await bcrypt.compare(password, this.password);
};

youtuberSchema.methods.generateToken = async function () {
	try {
		return generateToken(this._id, this.role);
	} catch (error) {
		console.log("Error while creating token");
	}
};
