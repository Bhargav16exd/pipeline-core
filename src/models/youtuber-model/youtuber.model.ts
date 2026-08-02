import mongoose, { Types } from "mongoose";
import { YoutuberModelType } from "./youtuber.model.types";
import { SubscriptionTypeEnum } from "../../types/subscription.types";
import { RoleEnum } from "../../types/misc.types";

//Schema
const youtuberSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		username: {
			type: String,
			unique: true,
			required: true
		},
		email: {
			type: String,
			unique: true,
			required: true
		},
		role: {
			type: String,
			enum: [RoleEnum.YOUTUBER],
			default: RoleEnum.YOUTUBER,
			required: true,
			select: false
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		teamId: {
			type: Types.ObjectId,
			ref: "Team"
		},
		subscriptionPlan: {
			type: String,
			enum: [SubscriptionTypeEnum.BASIC, SubscriptionTypeEnum.PRO, SubscriptionTypeEnum.DEV_CODE],
			required: true,
			default: SubscriptionTypeEnum.BASIC
		}
	},
	{
		timestamps: true
	}
);

const Client = mongoose.model<YoutuberModelType>("Youtuber", youtuberSchema);

export { Client, youtuberSchema };
