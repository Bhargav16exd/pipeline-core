interface YoutuberModelType extends Document {
	name: string;
	username: string;
	email: string;
	password: string;
	role: "YOUTUBER";
	teamId: string;
	isPasswordValid(password: string): Promise<boolean>;
	generateToken(): Promise<string>;
}

export { YoutuberModelType };
