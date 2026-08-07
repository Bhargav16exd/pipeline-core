interface OTPModelType {
	email: String;
	otp: String;
	expiresAt: Date;
	verified: Boolean;
}

export { OTPModelType };
