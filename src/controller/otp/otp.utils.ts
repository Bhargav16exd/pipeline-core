import { Otp } from "../../models/otp-model/otp.model";

//Generates OTP
const generateOtp = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export { generateOtp };
