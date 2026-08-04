import { NextFunction, Request, Response } from "express";
import { ControllerInputType } from "../../types/misc.types";
import errResponse from "../../utils/errResponse";
import { Youtuber } from "../../models/youtuber-model/youtuber.model";
import { Editor } from "../../models/editor-model/editor.model";
import sucResponse from "../../utils/sucResponse";
import { generateOtp } from "./otp.utils";
import { Otp } from "../../models/otp-model/otp.model";
import { sendOtpEmail } from "../../services/email.service";
import { OTP_ONBOARDING_EXPIRY } from "./otp.constants";

export const sendOtp = async ({ req, res, next }: ControllerInputType): Promise<void> => {
	try {
		//Get User Email Id
		const { email } = req.body;

		if (!email) throw new errResponse("Invalid Inputs", 400);

		//Verfiy if youtuber already exist with same email or username
		const [youtuberExists, editorExists] = await Promise.all([
			Youtuber.findOne({ email }),
			Editor.findOne({ email })
		]);

		if (youtuberExists || editorExists) throw new errResponse("Already Registered Email", 400);

		const otp = generateOtp();
		const expiresAt = new Date(Date.now() + Number(OTP_ONBOARDING_EXPIRY) * 60 * 1000);

		await Otp.deleteMany({ email });
		await Otp.create({ email, otp, expiresAt });

		await sendOtpEmail(email, otp);

		res.json(new sucResponse(true, 200, "OTP sent"));
	} catch (err: any) {
		next(err);
	}
};

export const verifyOtpHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { email, otp } = req.body;

		if (!email || !otp) throw new errResponse("Incomplete Inputs", 400);

		const record = await Otp.findOne({ email });

		if (!record) throw new errResponse("Invalid Request", 400);
		if (record.expiresAt < new Date()) throw new errResponse("Expired Otp", 400);

		if (record.otp !== otp) throw new errResponse("Invalid OTP", 400);

		record.verified = true;
		await record.save();

		res.json(new sucResponse(true, 200, "Email verified successfully"));
	} catch (err) {
		next(err);
	}
};
