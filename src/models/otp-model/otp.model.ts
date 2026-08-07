import mongoose from "mongoose";
import { OTPModelType } from "./otp.model.types";

const otpSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true
		},
		otp: {
			type: String,
			required: true
		},
		expiresAt: {
			type: Date,
			required: true
		},
		verified: {
			type: Boolean,
			required: true,
			default: false
		}
	},
	{ timestamps: true }
);

const Otp = mongoose.model<OTPModelType>("Otp", otpSchema);

export { Otp };
