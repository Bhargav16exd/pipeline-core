export interface EditorModelType extends Document {
	name: string;
	username: string;
	email: string;
	about: string;
	yearsOfExperience: number;
	profile: string;
	isInTeam: boolean;
	password: string;
	role: "ADMIN" | "YOUTUBER" | "EDITOR";
	teamId: any;
	isPasswordValid(password: string): Promise<boolean>;
	generateToken(): Promise<string>;
}
