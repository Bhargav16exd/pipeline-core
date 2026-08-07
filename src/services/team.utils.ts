import { ObjectId, Types } from "mongoose";
import { Team } from "../models/team.model";
import { Youtuber } from "../models/youtuber-model/youtuber.model";
import errResponse from "../utils/errResponse";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

/*
    Working Class : Helper Function
    Working  : Creates an Team when a new youtuber signup
*/

const createTeam = async (youtuberId: Types.ObjectId, username: string) => {
	const inviteCode = generateInviteCode(youtuberId);
	if (!inviteCode) throw new errResponse("Internal Server Error", 500);

	const team = await Team.create({
		name: username,
		inviteCode
	});

	if (!team) throw new errResponse("Something went wrong ", 500);

	await team.save();
	return team;
};

const linkYoutuberTeam = async (username: string, teamId: Types.ObjectId) => {
	await Youtuber.updateOne(
		{
			username
		},
		{ teamId }
	);
};

//Generate Invite Code
function generateInviteCode(input: Types.ObjectId) {
	const payload = `${input}+/${process.env.SALT}+/${process.env.COUPON_SECRET}`;
	const hash = crypto.createHash("sha256");
	const code = hash.update(payload).digest("hex");
	return code;
}

export { createTeam, linkYoutuberTeam };
